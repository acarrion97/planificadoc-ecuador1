import { describe, it, expect } from "vitest";

describe("PayPhone Configuration", () => {
  it("should have PAYPHONE_TOKEN configured", () => {
    const token = process.env.PAYPHONE_TOKEN;
    expect(token).toBeDefined();
    expect(token!.length).toBeGreaterThan(10);
  });

  it("should have PAYPHONE_STORE_ID configured", () => {
    const storeId = process.env.PAYPHONE_STORE_ID;
    expect(storeId).toBeDefined();
    expect(storeId!.length).toBeGreaterThan(10);
  });

  it(
    "should be able to reach PayPhone API",
    async () => {
      const token = process.env.PAYPHONE_TOKEN;
      const response = await fetch(
        "https://pay.payphonetodoesposible.com/api/button/V2/Confirm",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: 0, clientTxId: "test-connectivity" }),
        }
      );
      // Any HTTP response means the API is reachable
      expect(response.status).toBeDefined();
      console.log(`PayPhone API response status: ${response.status}`);
    },
    15000 // 15 second timeout for network call
  );
});
