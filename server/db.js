const Database = require("better-sqlite3");
const path = require("path");
const crypto = require("crypto");
const fs = require("fs");

const DB_PATH = process.env.DATABASE_PATH || path.join(__dirname, "dashy.sqlite3");
let db;

function initDb() {
  db = new Database(DB_PATH);

  // Enable WAL mode for better concurrent reads
  db.pragma("journal_mode = WAL");

  // ── Original data_sources table ──
  db.exec(`
    CREATE TABLE IF NOT EXISTS data_sources (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT,
      url TEXT,
      headers TEXT,
      cached_data TEXT,
      last_fetched TEXT,
      cache_ttl INTEGER DEFAULT 300,
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // ── data_sources column migrations ──
  const cols = db.prepare("PRAGMA table_info(data_sources)").all().map(c => c.name);
  if (!cols.includes("webhook_token")) db.exec("ALTER TABLE data_sources ADD COLUMN webhook_token TEXT");
  if (!cols.includes("db_type")) db.exec("ALTER TABLE data_sources ADD COLUMN db_type TEXT");
  if (!cols.includes("db_query")) db.exec("ALTER TABLE data_sources ADD COLUMN db_query TEXT");
  if (!cols.includes("user_id")) db.exec("ALTER TABLE data_sources ADD COLUMN user_id TEXT REFERENCES users(id) ON DELETE CASCADE");
  if (!cols.includes("is_global")) {
    db.exec("ALTER TABLE data_sources ADD COLUMN is_global INTEGER DEFAULT 0");
    // Mark all existing rows as global mock data
    db.exec("UPDATE data_sources SET is_global = 1 WHERE user_id IS NULL");
  }

  // ── Run 001_beta migration ──
  const migrationPath = path.join(__dirname, "migrations", "001_beta.sql");
  if (fs.existsSync(migrationPath)) {
    const sql = fs.readFileSync(migrationPath, "utf8");
    // Split on semicolons and run each statement
    sql.split(";").map(s => s.trim()).filter(Boolean).forEach(stmt => {
      try { db.exec(stmt + ";"); } catch (e) {
        // Ignore "already exists" errors
        if (!e.message.includes("already exists")) throw e;
      }
    });
  }
}

// ── data_sources ──────────────────────────────────────────────────────────────

function getAllSources(userId = null) {
  if (userId) {
    return db.prepare("SELECT * FROM data_sources WHERE user_id = ? OR is_global = 1 ORDER BY created_at ASC").all(userId);
  }
  return db.prepare("SELECT * FROM data_sources WHERE is_global = 1 ORDER BY created_at ASC").all();
}

function getSourceById(id) {
  return db.prepare("SELECT * FROM data_sources WHERE id = ?").get(id);
}

function getSourceByWebhookToken(token) {
  return db.prepare("SELECT * FROM data_sources WHERE webhook_token = ?").get(token);
}

function upsertSource(obj) {
  const id = obj.id || crypto.randomUUID();
  db.prepare(`
    INSERT INTO data_sources (id, name, type, url, headers, cached_data, last_fetched, cache_ttl, webhook_token, db_type, db_query, user_id, is_global)
    VALUES (@id, @name, @type, @url, @headers, @cached_data, @last_fetched, @cache_ttl, @webhook_token, @db_type, @db_query, @user_id, @is_global)
    ON CONFLICT(id) DO UPDATE SET
      name = excluded.name, type = excluded.type, url = excluded.url,
      headers = excluded.headers, cached_data = excluded.cached_data,
      last_fetched = excluded.last_fetched, cache_ttl = excluded.cache_ttl,
      webhook_token = excluded.webhook_token, db_type = excluded.db_type,
      db_query = excluded.db_query, user_id = excluded.user_id, is_global = excluded.is_global
  `).run({
    id, name: obj.name, type: obj.type, url: obj.url ?? null,
    headers: obj.headers ? JSON.stringify(obj.headers) : null,
    cached_data: obj.cached_data ?? null, last_fetched: obj.last_fetched ?? null,
    cache_ttl: obj.cache_ttl ?? 300, webhook_token: obj.webhook_token ?? null,
    db_type: obj.db_type ?? null, db_query: obj.db_query ?? null,
    user_id: obj.user_id ?? null, is_global: obj.is_global ?? 0,
  });
  return getSourceById(id);
}

function deleteSource(id) {
  db.prepare("DELETE FROM data_sources WHERE id = ?").run(id);
}

function updateCachedData(id, data, fetchedAt) {
  db.prepare("UPDATE data_sources SET cached_data = ?, last_fetched = ? WHERE id = ?")
    .run(JSON.stringify(data), fetchedAt, id);
}

// ── users ─────────────────────────────────────────────────────────────────────

function upsertUser({ id, email, display_name }) {
  db.prepare(`
    INSERT INTO users (id, email, display_name, last_seen_at)
    VALUES (@id, @email, @display_name, unixepoch())
    ON CONFLICT(id) DO UPDATE SET
      email = excluded.email,
      display_name = excluded.display_name,
      last_seen_at = unixepoch()
  `).run({ id, email, display_name: display_name ?? null });
  return db.prepare("SELECT * FROM users WHERE id = ?").get(id);
}

// ── user_preferences ──────────────────────────────────────────────────────────

function getPreferences(userId) {
  let prefs = db.prepare("SELECT * FROM user_preferences WHERE user_id = ?").get(userId);
  if (!prefs) {
    db.prepare(`
      INSERT OR IGNORE INTO user_preferences (user_id) VALUES (?)
    `).run(userId);
    prefs = db.prepare("SELECT * FROM user_preferences WHERE user_id = ?").get(userId);
  }
  return prefs;
}

function updatePreferences(userId, updates) {
  const allowed = ["default_theme", "default_mode", "default_viewport", "onboarding_completed"];
  const fields = Object.keys(updates).filter(k => allowed.includes(k));
  if (!fields.length) return getPreferences(userId);
  const set = fields.map(f => `${f} = @${f}`).join(", ");
  db.prepare(`UPDATE user_preferences SET ${set}, updated_at = unixepoch() WHERE user_id = @user_id`)
    .run({ ...updates, user_id: userId });
  return getPreferences(userId);
}

// ── dashboards ────────────────────────────────────────────────────────────────

function createDashboard({ userId, title, description, mode, prompt, html_content, generation_meta }) {
  const id = "dash_" + crypto.randomUUID().replace(/-/g, "").slice(0, 12);
  db.prepare(`
    INSERT INTO dashboards (id, user_id, title, description, mode, prompt, html_content, generation_meta)
    VALUES (@id, @user_id, @title, @description, @mode, @prompt, @html_content, @generation_meta)
  `).run({
    id, user_id: userId,
    title: title || "Untitled Dashboard",
    description: description ?? null,
    mode, prompt, html_content,
    generation_meta: generation_meta ? JSON.stringify(generation_meta) : null,
  });
  return getDashboardById(id, userId);
}

function getDashboardById(id, userId) {
  return db.prepare("SELECT * FROM dashboards WHERE id = ? AND user_id = ?").get(id, userId);
}

function listDashboards(userId, { limit = 20, offset = 0 } = {}) {
  const rows = db.prepare(`
    SELECT id, user_id, title, description, mode, is_public, public_slug, created_at, updated_at
    FROM dashboards WHERE user_id = ? ORDER BY updated_at DESC LIMIT ? OFFSET ?
  `).all(userId, limit, offset);
  const { total } = db.prepare("SELECT COUNT(*) as total FROM dashboards WHERE user_id = ?").get(userId);
  return { dashboards: rows, total, limit, offset };
}

function updateDashboard(id, userId, updates) {
  const allowed = ["title", "description", "html_content", "is_public", "public_slug"];
  const fields = Object.keys(updates).filter(k => allowed.includes(k));
  if (!fields.length) return getDashboardById(id, userId);
  const set = fields.map(f => `${f} = @${f}`).join(", ");
  db.prepare(`UPDATE dashboards SET ${set}, updated_at = unixepoch() WHERE id = @id AND user_id = @user_id`)
    .run({ ...updates, id, user_id: userId });
  return getDashboardById(id, userId);
}

function deleteDashboard(id, userId) {
  db.prepare("DELETE FROM dashboards WHERE id = ? AND user_id = ?").run(id, userId);
}

function getDashboardBySlug(slug) {
  return db.prepare("SELECT * FROM dashboards WHERE public_slug = ? AND is_public = 1").get(slug);
}

function enableShare(id, userId) {
  const slug = crypto.randomBytes(8).toString("hex");
  db.prepare("UPDATE dashboards SET is_public = 1, public_slug = ?, updated_at = unixepoch() WHERE id = ? AND user_id = ?")
    .run(slug, id, userId);
  return getDashboardById(id, userId);
}

function disableShare(id, userId) {
  db.prepare("UPDATE dashboards SET is_public = 0, public_slug = NULL, updated_at = unixepoch() WHERE id = ? AND user_id = ?")
    .run(id, userId);
  return getDashboardById(id, userId);
}

// ── usage_events ──────────────────────────────────────────────────────────────

function logUsageEvent(userId, event_type, mode = null) {
  db.prepare("INSERT INTO usage_events (user_id, event_type, mode) VALUES (?, ?, ?)").run(userId, event_type, mode);
}

function getUsageStats(userId) {
  const dayStart = Math.floor(Date.now() / 1000) - 86400;
  const hourStart = Math.floor(Date.now() / 1000) - 3600;
  const { today } = db.prepare(
    "SELECT COUNT(*) as today FROM usage_events WHERE user_id = ? AND event_type = 'generation' AND created_at >= ?"
  ).get(userId, dayStart);
  const { this_hour } = db.prepare(
    "SELECT COUNT(*) as this_hour FROM usage_events WHERE user_id = ? AND event_type = 'generation' AND created_at >= ?"
  ).get(userId, hourStart);
  return { today, this_hour, limit_day: 20, limit_hour: 5 };
}

module.exports = {
  initDb,
  getAllSources, getSourceById, getSourceByWebhookToken, upsertSource, deleteSource, updateCachedData,
  upsertUser, getPreferences, updatePreferences,
  createDashboard, getDashboardById, listDashboards, updateDashboard, deleteDashboard,
  getDashboardBySlug, enableShare, disableShare,
  logUsageEvent, getUsageStats,
};
