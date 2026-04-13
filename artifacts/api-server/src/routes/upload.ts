import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const UPLOADS_DIR = path.resolve(__dirname, "../../uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
  filename: (_req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e6)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${unique}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 },
});

const router = Router();

router.post("/upload", upload.single("file"), (req, res) => {
  const adminKey = req.headers["x-admin-key"] ?? req.body?.adminKey;
  if (adminKey !== "yasir123") {
    res.status(403).json({ error: "Forbidden" });
    return;
  }
  if (!req.file) {
    res.status(400).json({ error: "No file received" });
    return;
  }
  const fileUrl = `/api/uploads/${req.file.filename}`;
  res.json({
    url: fileUrl,
    originalName: req.file.originalname,
    mimeType: req.file.mimetype,
    size: req.file.size,
  });
});

router.get("/uploads/:filename", (req, res) => {
  const safeName = path.basename(req.params.filename);
  const filePath = path.join(UPLOADS_DIR, safeName);
  if (!fs.existsSync(filePath)) {
    res.status(404).json({ error: "File not found" });
    return;
  }
  res.sendFile(filePath);
});

export default router;
