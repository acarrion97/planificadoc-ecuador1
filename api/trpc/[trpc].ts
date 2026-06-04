/**
 * tRPC handler for Vercel — routes AI generation calls from the frontend.
 * Only exposes the `topics` router (generateAi, generatePlan) since that's
 * the only server-side functionality needed in production on Vercel.
 * Requires env vars: BUILT_IN_FORGE_API_KEY and BUILT_IN_FORGE_API_URL
 */
import type { VercelRequest, VercelResponse } from "@vercel/node";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { topicsRouter } from "../../server/topics-router";
import { pcaRouter } from "../../server/pca-router";
import { pcaTrimestralRouter } from "../../server/pca-trimestral-router";
import { inicialRouter } from "../../server/inicial-router";
import { router } from "../../server/_core/trpc";

// Router expuesto en Vercel
const vercelRouter = router({
  topics: topicsRouter,
  pca: pcaRouter,
  pcaTrimestral: pcaTrimestralRouter,
  inicial: inicialRouter,
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  try {
    // Convert Vercel's Node request to a Fetch API Request for @trpc/server/adapters/fetch
    const host = req.headers.host || "planificadoc.app";
    const url = `https://${host}${req.url}`;

    const headers = new Headers();
    for (const [key, value] of Object.entries(req.headers)) {
      if (value != null) {
        headers.set(key, Array.isArray(value) ? value.join(", ") : value);
      }
    }

    let bodyStr: string | undefined;
    if (req.method !== "GET" && req.method !== "HEAD") {
      bodyStr = typeof req.body === "string" ? req.body : JSON.stringify(req.body ?? {});
    }

    const fetchReq = new Request(url, {
      method: req.method || "GET",
      headers,
      body: bodyStr,
    });

    const response = await fetchRequestHandler({
      endpoint: "/api/trpc",
      req: fetchReq,
      router: vercelRouter,
      // topics router uses publicProcedure — no user/auth needed
      createContext: () => ({ req: req as any, res: res as any, user: null }),
      onError({ error, path }) {
        console.error(`[tRPC] Error in ${path}:`, error.message);
      },
    });

    res.status(response.status);
    response.headers.forEach((value: string, key: string) => {
      // Skip headers that Vercel manages
      if (!["transfer-encoding", "connection"].includes(key.toLowerCase())) {
        res.setHeader(key, value);
      }
    });

    const body = await response.text();
    res.send(body);
  } catch (err: any) {
    console.error("[tRPC handler] Unexpected error:", err);
    res.status(500).json({ error: "Internal server error", message: err?.message });
  }
}
