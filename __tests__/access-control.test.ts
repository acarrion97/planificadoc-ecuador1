import { describe, it, expect } from "vitest";
import { isValidCode, getValidCodes } from "../lib/access-control";

describe("Access Control - isValidCode", () => {
  it("should accept a valid code", () => {
    expect(isValidCode("PLANIFICA2026")).toBe(true);
  });

  it("should accept valid codes case-insensitively", () => {
    expect(isValidCode("planifica2026")).toBe(true);
    expect(isValidCode("Planifica2026")).toBe(true);
    expect(isValidCode("docente001")).toBe(true);
  });

  it("should accept codes with leading/trailing spaces", () => {
    expect(isValidCode("  DOCENTE001  ")).toBe(true);
    expect(isValidCode(" PROFE001 ")).toBe(true);
  });

  it("should reject invalid codes", () => {
    expect(isValidCode("INVALID123")).toBe(false);
    expect(isValidCode("")).toBe(false);
    expect(isValidCode("DOCENTE999")).toBe(false);
    expect(isValidCode("abc")).toBe(false);
  });

  it("should accept all DOCENTE codes (001-020)", () => {
    for (let i = 1; i <= 20; i++) {
      const code = `DOCENTE${String(i).padStart(3, "0")}`;
      expect(isValidCode(code)).toBe(true);
    }
  });

  it("should accept all PROFE codes (001-010)", () => {
    for (let i = 1; i <= 10; i++) {
      const code = `PROFE${String(i).padStart(3, "0")}`;
      expect(isValidCode(code)).toBe(true);
    }
  });

  it("should accept all EDUCA codes (001-010)", () => {
    for (let i = 1; i <= 10; i++) {
      const code = `EDUCA${String(i).padStart(3, "0")}`;
      expect(isValidCode(code)).toBe(true);
    }
  });

  it("should accept all PLAN codes (001-010)", () => {
    for (let i = 1; i <= 10; i++) {
      const code = `PLAN${String(i).padStart(3, "0")}`;
      expect(isValidCode(code)).toBe(true);
    }
  });
});

describe("Access Control - getValidCodes", () => {
  it("should return a non-empty array", () => {
    const codes = getValidCodes();
    expect(codes.length).toBeGreaterThan(0);
  });

  it("should return a copy (not the original array)", () => {
    const codes1 = getValidCodes();
    const codes2 = getValidCodes();
    expect(codes1).not.toBe(codes2);
    expect(codes1).toEqual(codes2);
  });

  it("should have 51 codes total", () => {
    // 1 PLANIFICA2026 + 20 DOCENTE + 10 PROFE + 10 EDUCA + 10 PLAN = 51
    expect(getValidCodes().length).toBe(51);
  });

  it("should have all unique codes", () => {
    const codes = getValidCodes();
    const unique = new Set(codes);
    expect(unique.size).toBe(codes.length);
  });
});
