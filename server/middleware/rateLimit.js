const { rateLimit, ipKeyGenerator } = require("express-rate-limit");

// Global safety net — 100 requests per minute per IP (no auth needed)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please slow down" },
});

// Per-user generation rate limit — 20/day, 5/hour
// Keyed on req.userId (set by requireAuth middleware)
const generationLimiterHour = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.userId, // Skip if no userId (handled by auth middleware)
  message: { error: "Generation limit reached: 5 per hour. Try again later.", limitType: "hour" },
});

const generationLimiterDay = rateLimit({
  windowMs: 24 * 60 * 60 * 1000,
  max: 20,
  keyGenerator: (req) => req.userId || ipKeyGenerator(req),
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => !req.userId,
  message: { error: "Daily generation limit reached: 20 per day. Try again tomorrow.", limitType: "day" },
});

module.exports = { globalLimiter, generationLimiterHour, generationLimiterDay };
