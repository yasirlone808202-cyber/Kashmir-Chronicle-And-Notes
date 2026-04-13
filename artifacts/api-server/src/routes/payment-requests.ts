import { Router } from "express";
import { db, paymentRequestsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { insertPaymentRequestSchema } from "@workspace/db";
import { sendPaymentNotification, sendApprovalEmail } from "../lib/mailer";

const router = Router();

function generateAccessCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

router.post("/payment-requests", async (req, res) => {
  const parsed = insertPaymentRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid request body", details: parsed.error.issues });
    return;
  }

  try {
    const [created] = await db
      .insert(paymentRequestsTable)
      .values(parsed.data)
      .returning();

    const host = req.headers.origin ?? `https://${req.headers.host}`;

    await sendPaymentNotification({
      userName: created.userName,
      userEmail: created.userEmail,
      noteTitle: created.noteTitle,
      subject: created.subject,
      classLevel: created.classLevel,
      upiTransactionId: created.upiTransactionId,
      requestId: created.id,
      adminUrl: host,
    });

    res.status(201).json(created);
  } catch (err) {
    req.log.error({ err }, "Failed to create payment request");
    res.status(500).json({ error: "Failed to create payment request" });
  }
});

router.get("/payment-requests", async (req, res) => {
  const { adminKey } = req.query;
  if (adminKey !== "yasir123") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  try {
    const requests = await db
      .select()
      .from(paymentRequestsTable)
      .orderBy(desc(paymentRequestsTable.createdAt));
    res.json(requests);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch payment requests");
    res.status(500).json({ error: "Failed to fetch payment requests" });
  }
});

router.get("/payment-requests/check", async (req, res) => {
  const { email, noteId } = req.query;
  if (!email || !noteId) {
    res.status(400).json({ error: "email and noteId required" });
    return;
  }

  try {
    const requests = await db
      .select()
      .from(paymentRequestsTable)
      .where(eq(paymentRequestsTable.userEmail, String(email)));

    const match = requests.find(
      (r) => r.noteId === String(noteId) && r.status === "approved"
    );

    res.json({ approved: !!match, accessCode: match ? "verified" : null });
  } catch (err) {
    req.log.error({ err }, "Failed to check payment status");
    res.status(500).json({ error: "Failed to check" });
  }
});

router.get("/payment-requests/verify-code", async (req, res) => {
  const { email, noteId, code } = req.query;
  if (!email || !noteId || !code) {
    res.status(400).json({ error: "email, noteId and code required" });
    return;
  }

  try {
    const requests = await db
      .select()
      .from(paymentRequestsTable)
      .where(eq(paymentRequestsTable.userEmail, String(email)));

    const match = requests.find(
      (r) =>
        r.noteId === String(noteId) &&
        r.status === "approved" &&
        r.upiTransactionId.endsWith(`|${String(code)}`)
    );

    res.json({ valid: !!match });
  } catch (err) {
    req.log.error({ err }, "Failed to verify access code");
    res.status(500).json({ error: "Failed to verify" });
  }
});

router.put("/payment-requests/:id/approve", async (req, res) => {
  const { adminKey } = req.body;
  if (adminKey !== "yasir123") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const accessCode = generateAccessCode();

    const [existing] = await db
      .select()
      .from(paymentRequestsTable)
      .where(eq(paymentRequestsTable.id, id));

    if (!existing) {
      res.status(404).json({ error: "Request not found" });
      return;
    }

    const newTxId = `${existing.upiTransactionId}|${accessCode}`;

    const [updated] = await db
      .update(paymentRequestsTable)
      .set({ status: "approved", upiTransactionId: newTxId })
      .where(eq(paymentRequestsTable.id, id))
      .returning();

    await sendApprovalEmail({
      userEmail: updated.userEmail,
      userName: updated.userName,
      noteTitle: updated.noteTitle,
      subject: updated.subject,
      classLevel: updated.classLevel,
      accessCode,
    });

    res.json({ ...updated, sentAccessCode: accessCode });
  } catch (err) {
    req.log.error({ err }, "Failed to approve payment request");
    res.status(500).json({ error: "Failed to approve" });
  }
});

router.put("/payment-requests/:id/reject", async (req, res) => {
  const { adminKey } = req.body;
  if (adminKey !== "yasir123") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }

  const id = Number(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  try {
    const [updated] = await db
      .update(paymentRequestsTable)
      .set({ status: "rejected" })
      .where(eq(paymentRequestsTable.id, id))
      .returning();

    res.json(updated);
  } catch (err) {
    req.log.error({ err }, "Failed to reject payment request");
    res.status(500).json({ error: "Failed to reject" });
  }
});

export default router;
