import type { VercelRequest, VercelResponse } from "@vercel/node";
import { handleCors } from "../_lib/admin-auth";
import { PRICING } from "../_lib/pricing";

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (handleCors(req, res)) return;

  res.json({
    monthly: {
      price: PRICING.monthly,
      displayPrice: "$" + (PRICING.monthly / 100).toFixed(2),
      period: "mes",
    },
    annual: {
      price: PRICING.annual,
      displayPrice: "$" + (PRICING.annual / 100).toFixed(2),
      period: "año",
      monthlyEquivalent: "$" + (PRICING.annual / 12 / 100).toFixed(2),
    },
  });
}
