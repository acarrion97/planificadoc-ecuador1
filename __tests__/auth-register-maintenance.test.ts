import { describe, expect, it } from "vitest";
import handler from "../api/auth/[action]";

async function callHandler(method: string) {
  const req: any = { query: { action: "register-maintenance" }, method, body: {}, headers: {} };
  const res: any = {
    statusCode: 200,
    body: undefined,
    setHeader() {},
    status(code: number) { this.statusCode = code; return this; },
    json(payload: any) { this.body = payload; return this; },
    end() { return this; },
  };
  await handler(req, res);
  return res;
}

describe("POST /api/auth/register-maintenance", () => {
  it("rechaza el registro especial y remite al registro normal", async () => {
    const res = await callHandler("POST");

    expect(res.statusCode).toBe(410);
    expect(res.body.error).toContain("Usa el registro normal");
  });

  it("mantiene deshabilitado el endpoint para cualquier método", async () => {
    const res = await callHandler("GET");

    expect(res.statusCode).toBe(410);
  });
});
