// ── External source fetch logic ───────────────────────────────────────────────

async function fetchGoogleSheets(config) {
  // config: { sheet_id, range, api_key }
  const range = config.range || "Sheet1";
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${config.sheet_id}/values/${encodeURIComponent(range)}?key=${config.api_key}`;
  const res = await fetch(url);
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Sheets API error ${res.status}`);
  }
  const data = await res.json();
  const rows = data.values || [];
  if (rows.length < 2) return [];
  const headers = rows[0];
  return rows.slice(1).map(row =>
    Object.fromEntries(headers.map((h, i) => [h, row[i] ?? ""]))
  );
}

async function fetchNotion(config) {
  // config: { token, database_id }
  const res = await fetch(`https://api.notion.com/v1/databases/${config.database_id}/query`, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${config.token}`,
      "Notion-Version": "2022-06-28",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ page_size: 100 }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.message || `Notion API error ${res.status}`);
  }
  const data = await res.json();
  // Flatten Notion properties into plain objects
  return (data.results || []).map(page => {
    const row = { id: page.id };
    for (const [key, prop] of Object.entries(page.properties || {})) {
      row[key] = extractNotionProp(prop);
    }
    return row;
  });
}

function extractNotionProp(prop) {
  switch (prop.type) {
    case "title":        return prop.title?.map(t => t.plain_text).join("") || "";
    case "rich_text":    return prop.rich_text?.map(t => t.plain_text).join("") || "";
    case "number":       return prop.number ?? null;
    case "select":       return prop.select?.name ?? null;
    case "multi_select": return prop.multi_select?.map(s => s.name).join(", ") || "";
    case "checkbox":     return prop.checkbox;
    case "date":         return prop.date?.start ?? null;
    case "email":        return prop.email ?? null;
    case "url":          return prop.url ?? null;
    case "phone_number": return prop.phone_number ?? null;
    default:             return null;
  }
}

async function fetchAirtable(config) {
  // config: { api_key, base_id, table_name }
  const url = `https://api.airtable.com/v0/${config.base_id}/${encodeURIComponent(config.table_name)}`;
  const res = await fetch(url, {
    headers: { "Authorization": `Bearer ${config.api_key}` },
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Airtable API error ${res.status}`);
  }
  const data = await res.json();
  return (data.records || []).map(r => ({ id: r.id, ...r.fields }));
}

async function fetchDatabase(config) {
  // config: { db_type: 'postgres'|'mysql', connection_string, query }
  if (config.db_type === "postgres") {
    const { Client } = require("pg");
    const client = new Client({ connectionString: config.connection_string, ssl: { rejectUnauthorized: false } });
    await client.connect();
    try {
      const result = await client.query(config.query);
      return result.rows;
    } finally {
      await client.end();
    }
  } else if (config.db_type === "mysql") {
    const mysql = require("mysql2/promise");
    const conn = await mysql.createConnection(config.connection_string);
    try {
      const [rows] = await conn.execute(config.query);
      return rows;
    } finally {
      await conn.end();
    }
  }
  throw new Error(`Unsupported db_type: ${config.db_type}`);
}

async function fetchSource(source) {
  const config = source.headers ? JSON.parse(source.headers) : {};

  switch (source.type) {
    case "url": {
      const res = await fetch(source.url, { headers: config });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return await res.json();
    }
    case "sheets":
      return await fetchGoogleSheets(config);
    case "notion":
      return await fetchNotion(config);
    case "airtable":
      return await fetchAirtable(config);
    case "db":
      return await fetchDatabase({ ...config, db_type: source.db_type, query: source.db_query });
    default:
      throw new Error(`Source type '${source.type}' is not fetchable`);
  }
}

module.exports = { fetchSource };
