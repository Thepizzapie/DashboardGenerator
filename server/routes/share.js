const express = require("express");
const { getDashboardBySlug } = require("../db");

const router = express.Router();

// GET /api/share/:slug — public, no auth
router.get("/:slug", (req, res) => {
  const dash = getDashboardBySlug(req.params.slug);
  if (!dash) return res.status(404).json({ error: "Dashboard not found or no longer public" });
  // Only expose safe fields for public view
  const { id, title, mode, html_content, created_at } = dash;
  res.json({ id, title, mode, html_content, created_at });
});

module.exports = router;
