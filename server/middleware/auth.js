const { createClerkClient } = require("@clerk/express");
const { upsertUser } = require("../db");

// Gracefully skip auth in dev when no Clerk keys are set
const DEV_MODE = !process.env.CLERK_SECRET_KEY;

if (DEV_MODE) {
  console.warn("[auth] CLERK_SECRET_KEY not set — running in dev mode, auth bypassed");
}

const clerkClient = DEV_MODE ? null : createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY });

let devUserSeeded = false;

async function requireAuth(req, res, next) {
  if (DEV_MODE) {
    if (!devUserSeeded) {
      try { upsertUser({ id: "dev_user", email: "dev@localhost", display_name: "Dev User" }); } catch (_) {}
      devUserSeeded = true;
    }
    req.userId = "dev_user";
    req.userEmail = "dev@localhost";
    return next();
  }

  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Missing authorization token" });
  }

  const token = authHeader.slice(7);

  try {
    const payload = await clerkClient.verifyToken(token);
    req.userId = payload.sub;

    // Upsert user in our DB (best-effort, get email from Clerk if possible)
    try {
      const clerkUser = await clerkClient.users.getUser(payload.sub);
      const email = clerkUser.emailAddresses?.[0]?.emailAddress ?? `${payload.sub}@unknown`;
      const display_name = [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") || null;
      upsertUser({ id: payload.sub, email, display_name });
    } catch (_) {
      // Don't fail the request if user lookup fails
    }

    next();
  } catch (err) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
