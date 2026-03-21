const express = require("express");
const { z } = require("zod");
const {
  createDashboard, getDashboardById, listDashboards,
  updateDashboard, deleteDashboard, enableShare, disableShare,
} = require("../db");
const { requireAuth } = require("../middleware/auth");
const { hydrateHtml } = require("../hydrateHtml");

const router = express.Router();
router.use(requireAuth);

const createSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  mode: z.enum(["html", "mui", "charts", "infographic", "diagram"]),
  prompt: z.string().max(5000),
  html_content: z.string(),
  generation_meta: z.any().optional(),
});

const updateSchema = z.object({
  title: z.string().max(200).optional(),
  description: z.string().max(1000).optional(),
  html_content: z.string().optional(),
});

// POST /api/dashboards
router.post("/", (req, res) => {
  const parsed = createSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  const data = { ...parsed.data };
  if (data.html_content) data.html_content = hydrateHtml(data.html_content);
  const dash = createDashboard({ userId: req.userId, ...data });
  res.status(201).json(dash);
});

// GET /api/dashboards
router.get("/", (req, res) => {
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const offset = parseInt(req.query.offset) || 0;
  res.json(listDashboards(req.userId, { limit, offset }));
});

// GET /api/dashboards/:id
router.get("/:id", (req, res) => {
  const dash = getDashboardById(req.params.id, req.userId);
  if (!dash) return res.status(404).json({ error: "Dashboard not found" });
  res.json(dash);
});

// PATCH /api/dashboards/:id
router.patch("/:id", (req, res) => {
  const dash = getDashboardById(req.params.id, req.userId);
  if (!dash) return res.status(404).json({ error: "Dashboard not found" });
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  res.json(updateDashboard(req.params.id, req.userId, parsed.data));
});

// DELETE /api/dashboards/:id
router.delete("/:id", (req, res) => {
  const dash = getDashboardById(req.params.id, req.userId);
  if (!dash) return res.status(404).json({ error: "Dashboard not found" });
  deleteDashboard(req.params.id, req.userId);
  res.status(204).end();
});

// POST /api/dashboards/:id/share — enable public link
router.post("/:id/share", (req, res) => {
  const dash = getDashboardById(req.params.id, req.userId);
  if (!dash) return res.status(404).json({ error: "Dashboard not found" });
  const updated = enableShare(req.params.id, req.userId);
  res.json({ slug: updated.public_slug, url: `/share/${updated.public_slug}` });
});

// DELETE /api/dashboards/:id/share — disable public link
router.delete("/:id/share", (req, res) => {
  const dash = getDashboardById(req.params.id, req.userId);
  if (!dash) return res.status(404).json({ error: "Dashboard not found" });
  disableShare(req.params.id, req.userId);
  res.status(204).end();
});

module.exports = router;
