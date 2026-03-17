const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");

const DB_PATH = path.join(__dirname, "dashy.sqlite3");
let db;

function initDb() {
  db = new Database(DB_PATH);
  db.exec(`
    CREATE TABLE IF NOT EXISTS data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('url', 'csv', 'json')),
      url TEXT,
      headers TEXT,
      cached_data TEXT,
      last_fetched TEXT,
      cache_ttl INTEGER DEFAULT 300,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

function getAllSources() {
  return db.prepare("SELECT * FROM data_sources ORDER BY created_at ASC").all();
}

function getSourceById(id) {
  return db.prepare("SELECT * FROM data_sources WHERE id = ?").get(id);
}

function upsertSource(obj) {
  const id = obj.id || crypto.randomUUID();
  db.prepare(`
    INSERT INTO data_sources (id, name, type, url, headers, cached_data, last_fetched, cache_ttl)
    VALUES (@id, @name, @type, @url, @headers, @cached_data, @last_fetched, @cache_ttl)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name,
      type = excluded.type,
      url = excluded.url,
      headers = excluded.headers,
      cached_data = excluded.cached_data,
      last_fetched = excluded.last_fetched,
      cache_ttl = excluded.cache_ttl
  `).run({
    id,
    name: obj.name,
    type: obj.type,
    url: obj.url ?? null,
    headers: obj.headers ? JSON.stringify(obj.headers) : null,
    cached_data: obj.cached_data ?? null,
    last_fetched: obj.last_fetched ?? null,
    cache_ttl: obj.cache_ttl ?? 300,
  });
  return getSourceById(id);
}

function deleteSource(id) {
  db.prepare("DELETE FROM data_sources WHERE id = ?").run(id);
}

function updateCachedData(id, data, fetchedAt) {
  db.prepare(`
    UPDATE data_sources SET cached_data = ?, last_fetched = ? WHERE id = ?
  `).run(JSON.stringify(data), fetchedAt, id);
}

module.exports = { initDb, getAllSources, getSourceById, upsertSource, deleteSource, updateCachedData };
