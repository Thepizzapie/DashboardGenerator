const express = require("express");
const { getUsageStats } = require("../db");
const { requireAuth } = require("../middleware/auth");

const router = express.Router();
router.use(requireAuth);

// GET /api/usage/me
router.get("/me", (req, res) => {
  res.json(getUsageStats(req.userId));
});

module.exports = router;
