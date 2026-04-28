import { describe, it, expect } from "vitest";
import { getPriceForPlan } from "../server/payphone";

describe("PayPhone Integration", () => {
  describe("Pricing Logic", () => {
    it("should return monthly price of $6.99 (699 cents)", () => {
      const pricing = getPriceForPlan("monthly");
      expect(pricing.amount).toBe(699);
      expect(pricing.plan).toBe("monthly");
      expect(pricing.label).toContain("6.99");
      expect(pricing.durationMonths).toBe(1);
      expect(pricing.monthlyEquivalent).toBe(699);
    });

    it("should return annual price of $75.51 (7551 cents)", () => {
      const pricing = getPriceForPlan("annual");
      expect(pricing.amount).toBe(7551);
      expect(pricing.plan).toBe("annual");
      expect(pricing.label).toContain("75.51");
      expect(pricing.durationMonths).toBe(12);
      expect(pricing.monthlyEquivalent).toBe(629);
    });

    it("annual plan should be cheaper per month than monthly", () => {
      const monthly = getPriceForPlan("monthly");
      const annual = getPriceForPlan("annual");
      expect(annual.monthlyEquivalent).toBeLessThan(monthly.monthlyEquivalent);
    });

    it("annual plan should save approximately 10%", () => {
      const monthly = getPriceForPlan("monthly");
      const annual = getPriceForPlan("annual");
      const monthlyCostForYear = monthly.amount * 12; // 8388
      const savings = ((monthlyCostForYear - annual.amount) / monthlyCostForYear) * 100;
      expect(savings).toBeGreaterThan(8);
      expect(savings).toBeLessThan(12);
    });
  });

  describe("Payment API Endpoints", () => {
    const BASE_URL = "http://127.0.0.1:3000";

    it("should return pricing info with monthly and annual options", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/pricing`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.monthly).toBeDefined();
      expect(data.monthly.amount).toBe(699);
      expect(data.annual).toBeDefined();
      expect(data.annual.amount).toBe(7551);
      expect(data.annual.savings).toBe("10%");
    });

    it("should return inactive status for non-subscriber", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/status?email=noexiste@test.com`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.active).toBe(false);
      expect(data.pricing).toBeDefined();
      expect(data.pricing.monthly.amount).toBe(699);
      expect(data.pricing.annual.amount).toBe(7551);
    });

    it("should return error for missing email on status", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/status?email=`);
      expect(res.status).toBe(200);
      const data = await res.json();
      expect(data.active).toBe(false);
    });

    it("should return monthly payment page HTML for valid email", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/page?email=docente@test.com&plan=monthly`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("PlanificaDoc");
      expect(html).toContain("PayPhone");
      expect(html).toContain("payphone-payment-box");
      expect(html).toContain("docente@test.com");
      expect(html).toContain("6.99");
    });

    it("should return annual payment page HTML when plan=annual", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/page?email=docente@test.com&plan=annual`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("PlanificaDoc");
      expect(html).toContain("75.51");
      expect(html).toContain("Ahorras 10%");
    });

    it("should default to monthly plan when no plan specified", async () => {
      const res = await fetch(`${BASE_URL}/api/payment/page?email=docente@test.com`);
      expect(res.status).toBe(200);
      const html = await res.text();
      expect(html).toContain("6.99");
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
