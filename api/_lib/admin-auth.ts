import type { VercelRequest, VercelResponse } from "@vercel/node";

const ADMIN_SECRET = process.env.ADMIN_SECRET || "planificadoc-admin-2026";

export function verifyAdmin(req: VercelRequest): boolean {
  const key =
    (req.query.key as string) || (req.headers["x-admin-key"] as string);
  return key === ADMIN_SECRET;
}

export function corsHeaders(res: VercelResponse): VercelResponse {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization, X-Admin-Key"
  );
  return res;
}

export function handleCors(
  req: VercelRequest,
  res: VercelResponse
): boolean {
  corsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}
