const express = require("express");
const multer = require("multer");
const { parse } = require("csv-parse/sync");
const { getAllSources, getSourceById, upsertSource, deleteSource, updateCachedData } = require("../db");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

// Sanitize a source row for the client (omit cached_data, parse headers)
function sanitize(row) {
  const { cached_data, headers, ...rest } = row;
  return {
    ...rest,
    headers: headers ? JSON.parse(headers) : {},
    hasData: !!cached_data,
  };
}

// GET /api/sources
router.get("/sources", (req, res) => {
  const rows = getAllSources();
  res.json(rows.map(sanitize));
});

// POST /api/sources
router.post("/sources", (req, res) => {
  const { name, type, url, headers, data } = req.body;
  if (!name || !type) return res.status(400).json({ error: "name and type are required" });

  const now = new Date().toISOString();
  const obj = { name, type, url: url ?? null, headers: headers ?? {} };

  if (type === "json") {
    obj.cached_data = JSON.stringify(data);
    obj.last_fetched = now;
  }

  const source = upsertSource(obj);
  res.status(201).json(sanitize(source));
});

// DELETE /api/sources/:id
router.delete("/sources/:id", (req, res) => {
  deleteSource(req.params.id);
  res.status(204).end();
});

// POST /api/sources/:id/fetch
router.post("/sources/:id/fetch", async (req, res) => {
  const source = getSourceById(req.params.id);
  if (!source) return res.status(404).json({ error: "Source not found" });

  const force = req.query.force === "true";

  // Check cache validity unless forced
  if (!force && source.last_fetched && source.cached_data) {
    const age = (Date.now() - new Date(source.last_fetched).getTime()) / 1000;
    if (age < source.cache_ttl) {
      return res.json({ source: sanitize(source), data: JSON.parse(source.cached_data), fromCache: true });
    }
  }

  try {
    const headers = source.headers ? JSON.parse(source.headers) : {};
    const response = await fetch(source.url, { headers });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = await response.json();
    const now = new Date().toISOString();
    updateCachedData(source.id, data, now);
    const updated = getSourceById(source.id);
    res.json({ source: sanitize(updated), data, fromCache: false });
  } catch (err) {
    // Return stale cache on error if available
    if (source.cached_data) {
      return res.json({ source: sanitize(source), data: JSON.parse(source.cached_data), fromCache: true, fetchError: err.message });
    }
    res.status(502).json({ error: err.message });
  }
});

// POST /api/upload-csv
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
  const source = upsertSource({
    name,
    type: "csv",
    cached_data: JSON.stringify(data),
    last_fetched: now,
  });

  res.status(201).json({ source: sanitize(source), data });
});

module.exports = router;
