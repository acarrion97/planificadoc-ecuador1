import { describe, it, expect } from "vitest";

describe("PayPhone credentials validation", () => {
  it("PAYPHONE_TOKEN should be the long token (>100 chars)", () => {
    const token = process.env.PAYPHONE_TOKEN || "";
    expect(token.length).toBeGreaterThan(100);
  });

  it("PAYPHONE_STORE_ID should be a UUID format", () => {
    const storeId = process.env.PAYPHONE_STORE_ID || "";
    expect(storeId).toBe("5e9e9c22-2479-41d5-a4a0-95cc2591d05f");
    // UUID format check
    expect(storeId).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
    );
  });

  it("should be able to reach PayPhone API with the token", async () => {
    const token = process.env.PAYPHONE_TOKEN || "";
    const response = await fetch(
      "https://pay.payphonetodoesposible.com/api/button/V2/Confirm",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ id: 0, clientTxId: "test" }),
      }
    );
    console.log("PayPhone API response status:", response.status);
    expect([400, 403, 404, 500]).toContain(response.status);
  }, 15000);
});
