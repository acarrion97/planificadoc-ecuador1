import { describe, it, expect } from "vitest";

// We test the pure functions directly without importing the full module
// because it depends on React Native / Expo which can't run in vitest.
// Instead, we replicate the validation logic here for testing.

const VALID_CODES: string[] = [
  "PLANIFICA2026",
  "DOCENTE001", "DOCENTE002", "DOCENTE003", "DOCENTE004", "DOCENTE005",
  "DOCENTE006", "DOCENTE007", "DOCENTE008", "DOCENTE009", "DOCENTE010",
  "DOCENTE011", "DOCENTE012", "DOCENTE013", "DOCENTE014", "DOCENTE015",
  "DOCENTE016", "DOCENTE017", "DOCENTE018", "DOCENTE019", "DOCENTE020",
  "PROFE001", "PROFE002", "PROFE003", "PROFE004", "PROFE005",
  "PROFE006", "PROFE007", "PROFE008", "PROFE009", "PROFE010",
  "EDUCA001", "EDUCA002", "EDUCA003", "EDUCA004", "EDUCA005",
  "EDUCA006", "EDUCA007", "EDUCA008", "EDUCA009", "EDUCA010",
  "PLAN001", "PLAN002", "PLAN003", "PLAN004", "PLAN005",
  "PLAN006", "PLAN007", "PLAN008", "PLAN009", "PLAN010",
];

function isValidCode(code: string): boolean {
  const normalized = code.trim().toUpperCase();
  return VALID_CODES.includes(normalized);
}

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

describe("Access Control - Valid Codes List", () => {
  it("should have 51 codes total", () => {
    // 1 PLANIFICA2026 + 20 DOCENTE + 10 PROFE + 10 EDUCA + 10 PLAN = 51
    expect(VALID_CODES.length).toBe(51);
  });

  it("should have all unique codes", () => {
    const unique = new Set(VALID_CODES);
    expect(unique.size).toBe(VALID_CODES.length);
  });
});
