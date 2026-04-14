import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "@workspace/db";
import { usersTable } from "@workspace/db";
import { paymentRequestsTable } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();
const JWT_SECRET = process.env.SESSION_SECRET ?? "kashmir-portal-secret-fallback";

function makeToken(userId: number, email: string) {
  return jwt.sign({ userId, email }, JWT_SECRET, { expiresIn: "30d" });
}

function verifyToken(token: string): { userId: number; email: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
  } catch {
    return null;
  }
}

function getTokenFromHeader(req: import("express").Request): { userId: number; email: string } | null {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) return null;
  return verifyToken(auth.slice(7));
}

router.post("/auth/signup", async (req, res) => {
  const { name, email, password } = req.body ?? {};
  if (!name?.trim() || !email?.trim() || !password) {
    res.status(400).json({ error: "Name, email and password are required." });
    return;
  }
  if (!email.includes("@")) {
    res.status(400).json({ error: "Invalid email address." });
    return;
  }
  if (password.length < 6) {
    res.status(400).json({ error: "Password must be at least 6 characters." });
    return;
  }

  try {
    const existing = await db.select().from(usersTable).where(eq(usersTable.email, email.trim().toLowerCase()));
    if (existing.length > 0) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const [user] = await db.insert(usersTable).values({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      passwordHash,
    }).returning();

    const token = makeToken(user.id, user.email);
    res.status(201).json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    req.log.error({ err }, "Signup failed");
    res.status(500).json({ error: "Failed to create account." });
  }
});

router.post("/auth/login", async (req, res) => {
  const { email, password } = req.body ?? {};
  if (!email?.trim() || !password) {
    res.status(400).json({ error: "Email and password are required." });
    return;
  }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.email, email.trim().toLowerCase()));
    if (!user) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      res.status(401).json({ error: "Invalid email or password." });
      return;
    }

    const token = makeToken(user.id, user.email);
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  } catch (err) {
    req.log.error({ err }, "Login failed");
    res.status(500).json({ error: "Login failed." });
  }
});

router.get("/auth/me", async (req, res) => {
  const payload = getTokenFromHeader(req);
  if (!payload) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const [user] = await db.select().from(usersTable).where(eq(usersTable.id, payload.userId));
    if (!user) { res.status(404).json({ error: "User not found" }); return; }
    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    req.log.error({ err }, "Me failed");
    res.status(500).json({ error: "Failed to fetch user" });
  }
});

router.get("/auth/my-notes", async (req, res) => {
  const payload = getTokenFromHeader(req);
  if (!payload) { res.status(401).json({ error: "Unauthorized" }); return; }

  try {
    const approved = await db.select().from(paymentRequestsTable).where(
      and(eq(paymentRequestsTable.userEmail, payload.email), eq(paymentRequestsTable.status, "approved"))
    );
    const unlocked = approved.map((r) => ({
      noteId: r.noteId,
      noteTitle: r.noteTitle,
      subject: r.subject,
      classLevel: r.classLevel,
      accessCode: r.upiTransactionId.split("|")[1] ?? "",
    }));
    res.json(unlocked);
  } catch (err) {
    req.log.error({ err }, "my-notes failed");
    res.status(500).json({ error: "Failed to fetch notes" });
  }
});

export { verifyToken, getTokenFromHeader };
export default router;
