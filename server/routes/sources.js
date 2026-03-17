const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const crypto = require("crypto");
const { getAllSources, getSourceById, getSourceByWebhookToken, upsertSource, deleteSource, updateCachedData } = require("../db");
const { fetchSource } = require("../connectors");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Sanitize a source row for the client
function sanitize(row) {
  const { cached_data, headers, db_query, ...rest } = row;
  let config = {};
  try { config = headers ? JSON.parse(headers) : {}; } catch (_) {}

  // Mask sensitive fields before sending to client
  const maskedConfig = {};
  for (const [k, v] of Object.entries(config)) {
    const sensitive = ["api_key", "token", "connection_string", "password"];
    maskedConfig[k] = sensitive.some(s => k.toLowerCase().includes(s)) && v
      ? "••••••••"
      : v;
  }

  return {
    ...rest,
    config: maskedConfig,
    hasData: !!cached_data,
    webhookUrl: row.webhook_token ? `/api/webhook/${row.webhook_token}` : null,
  };
}

// ── GET /api/sources ──────────────────────────────────────────────────────────

router.get("/sources", (req, res) => {
  res.json(getAllSources().map(sanitize));
});

// ── POST /api/sources ─────────────────────────────────────────────────────────

router.post("/sources", async (req, res) => {
  const { name, type, url, config = {}, db_type, db_query, data } = req.body;
  if (!name || !type) return res.status(400).json({ error: "name and type are required" });

  const now = new Date().toISOString();
  const obj = { name, type, url: url ?? null, headers: config, db_type: db_type ?? null, db_query: db_query ?? null };

  // JSON paste — store immediately
  if (type === "json") {
    obj.cached_data = JSON.stringify(data);
    obj.last_fetched = now;
  }

  // Webhook — generate unique token
  if (type === "webhook") {
    obj.webhook_token = crypto.randomBytes(24).toString("hex");
  }

  const source = upsertSource(obj);

  // Auto-fetch live sources on creation
  const fetchable = ["url", "sheets", "notion", "airtable", "db"];
  if (fetchable.includes(type)) {
    try {
      const fetched = await fetchSource(source);
      updateCachedData(source.id, fetched, now);
      const updated = getSourceById(source.id);
      return res.status(201).json({ source: sanitize(updated), preview: fetched.slice(0, 5) });
    } catch (err) {
      // Still save the source, just report the fetch error
      return res.status(201).json({ source: sanitize(source), fetchError: err.message });
    }
  }

  res.status(201).json({ source: sanitize(source) });
});

// ── POST /api/sources/preview ─────────────────────────────────────────────────
// Fetch + return preview without saving anything

router.post("/sources/preview", async (req, res) => {
  const { type, url, config = {}, db_type, db_query } = req.body;
  const mockSource = { type, url, headers: JSON.stringify(config), db_type, db_query };
  try {
    const data = await fetchSource(mockSource);
    res.json({ data, preview: data.slice(0, 10) });
  } catch (err) {
    res.status(502).json({ error: err.message });
  }
});

// ── DELETE /api/sources/:id ───────────────────────────────────────────────────

router.delete("/sources/:id", (req, res) => {
  deleteSource(req.params.id);
  res.status(204).end();
});

// ── POST /api/sources/:id/fetch ───────────────────────────────────────────────

router.post("/sources/:id/fetch", async (req, res) => {
  const source = getSourceById(req.params.id);
  if (!source) return res.status(404).json({ error: "Source not found" });

  const force = req.query.force === "true";

  if (!force && source.last_fetched && source.cached_data) {
    const age = (Date.now() - new Date(source.last_fetched).getTime()) / 1000;
    if (age < source.cache_ttl) {
      return res.json({ source: sanitize(source), data: JSON.parse(source.cached_data), fromCache: true });
    }
  }

  try {
    const data = await fetchSource(source);
    const now = new Date().toISOString();
    updateCachedData(source.id, data, now);
    const updated = getSourceById(source.id);
    res.json({ source: sanitize(updated), data, fromCache: false });
  } catch (err) {
    if (source.cached_data) {
      return res.json({ source: sanitize(source), data: JSON.parse(source.cached_data), fromCache: true, fetchError: err.message });
    }
    res.status(502).json({ error: err.message });
  }
});

// ── POST /api/upload-csv ──────────────────────────────────────────────────────

router.post("/upload-csv", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "No file uploaded" });
  const name = req.body.name || req.file.originalname.replace(/\.csv$/i, "");

  let data;
  try {
    data = parse(req.file.buffer, { columns: true, skip_empty_lines: true });
  } catch (err) {
    return res.status(400).json({ error: `CSV parse error: ${err.message}` });
  }

  const now = new Date().toISOString();
  const source = upsertSource({ name, type: "csv", cached_data: JSON.stringify(data), last_fetched: now });
  res.status(201).json({ source: sanitize(source), data });
});

// ── POST /api/webhook/:token ──────────────────────────────────────────────────
// External services push data to this endpoint

router.post("/webhook/:token", express.json(), (req, res) => {
  const source = getSourceByWebhookToken(req.params.token);
  if (!source) return res.status(404).json({ error: "Unknown webhook token" });

  const payload = req.body;
  const data = Array.isArray(payload) ? payload : [payload];
  updateCachedData(source.id, data, new Date().toISOString());
  res.json({ ok: true, rows: data.length });
});

module.exports = router;
