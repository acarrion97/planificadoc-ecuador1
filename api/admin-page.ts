import type { VercelRequest, VercelResponse } from "@vercel/node";
import fs from "fs";
import path from "path";

/**
 * Serves admin.html directly from source (bypasses Expo build cache).
 * Mapped via vercel.json rewrite: /admin.html → /api/admin-page
 */
export default function handler(_req: VercelRequest, res: VercelResponse) {
  try {
    const htmlPath = path.join(process.cwd(), "public", "admin.html");
    const html = fs.readFileSync(htmlPath, "utf8");
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
    res.status(200).send(html);
  } catch (e) {
    res.status(500).send("Error loading admin page");
  }
}
