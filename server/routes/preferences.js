const express = require("express");
const { z } = require("zod");
const { getPreferences, updatePreferences } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

const updateSchema = z.object({
  default_theme: z.enum(["dark", "light"]).optional(),
  default_mode: z.enum(["html", "mui", "charts", "infographic", "diagram"]).optional(),
  default_viewport: z.enum(["desktop", "tablet", "mobile"]).optional(),
  onboarding_completed: z.number().int().min(0).max(1).optional(),
});

// GET /api/preferences
router.get("/", (req, res) => {
  res.json(getPreferences(req.userId));
});

// PUT /api/preferences
router.put("/", (req, res) => {
  const parsed = updateSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors[0].message });
  res.json(updatePreferences(req.userId, parsed.data));
});

module.exports = router;
