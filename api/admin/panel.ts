import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyAdmin } from "../_lib/admin-auth";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (!verifyAdmin(req)) {
    return res.status(401).send("No autorizado. Agrega ?key=TU_CLAVE a la URL.");
  }

  // Redirect to the static admin.html page
  const key = req.query.key as string;
  res.redirect(302, `/admin.html?key=${encodeURIComponent(key)}`);
}
