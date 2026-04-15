import { describe, it, expect } from "vitest";
import { getPriceForEmail } from "../server/payphone";

describe("PayPhone Integration", () => {
  describe("Pricing Logic", () => {
    it("should return promo price for first-time subscribers", () => {
      const pricing = getPriceForEmail(0);
      expect(pricing.amount).toBe(499);
      expect(pricing.isPromo).toBe(true);
      expect(pricing.label).toContain("4.99");
    });

    it("should return promo price for second month", () => {
      const pricing = getPriceForEmail(1);
      expect(pricing.amount).toBe(499);
      expect(pricing.isPromo).toBe(true);
    });

    it("should return promo price for third month", () => {
      const pricing = getPriceForEmail(2);
      expect(pricing.amount).toBe(499);
      expect(pricing.isPromo).toBe(true);
    });

    it("should return regular price after 3 months", () => {
      const pricing = getPriceForEmail(3);
      expect(pricing.amount).toBe(699);
      expect(pricing.isPromo).toBe(false);
      expect(pricing.label).toContain("6.99");
    });

    it("should return regular price for long-term subscribers", () => {
      const pricing = getPriceForEmail(12);
      expect(pricing.amount).toBe(699);
      expect(pricing.isPromo).toBe(false);
    });
  });

  describe("Payment API Endpoints", () => {
    const BASE_URL = "http://127.0.0.1:3000";

    it("should return pricing info for new email", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/pricing?email=nuevo@test.com`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.amount).toBe(499);
      expect(data.isPromo).toBe(true);
      expect(data.promoMonthsRemaining).toBe(3);
      expect(data.regularPrice).toBe(699);
      expect(data.promoPrice).toBe(499);
    });

    it("should return inactive status for non-subscriber", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/status?email=noexiste@test.com`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.active).toBe(false);
      expect(data.pricing).toBeDefined();
    });

    it("should return error for missing email on status", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/status?email=`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.active).toBe(false);
    });

    it("should return payment page HTML for valid email", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/page?email=docente@test.com`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("PlanificaDoc");
      expect(html).toContain("PayPhone");
      expect(html).toContain("payphone-payment-box");
      expect(html).toContain("docente@test.com");
    });

    it("should reject payment page without email", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/page?email=`);
      expect(res.status).toBe(400);
    });

    it("should handle confirm with missing params", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/confirm`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("faltantes");
    });
  });
});
