import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@react-native-async-storage/async-storage", () => ({
  default: {
    getItem: vi.fn(),
    setItem: vi.fn(),
  },
}));

vi.mock("expo-crypto", () => ({
  randomUUID: vi.fn(() => "device-id"),
}));

import { mergeMissingById } from "../lib/local-cloud-backup";

describe("mergeMissingById", () => {
  beforeEach(() => {
    vi.spyOn(console, "warn").mockImplementation(() => undefined);
  });

  it("preserves local versions and restores cloud records missing locally", () => {
    const merged = mergeMissingById(
      [{ id: "local", title: "local edit" }],
      [
        { tipo: "diario", itemId: "local", form: JSON.stringify({ id: "local", title: "old cloud" }) },
        { tipo: "diario", itemId: "restored", form: JSON.stringify({ id: "restored", title: "from cloud" }) },
        { tipo: "semanal", itemId: "other-type", form: JSON.stringify({ id: "other-type" }) },
      ],
      "diario",
    );

    expect(merged).toEqual([
      { id: "local", title: "local edit" },
      { id: "restored", title: "from cloud" },
    ]);
  });

  it("skips malformed or mismatched cloud records", () => {
    const merged = mergeMissingById(
      [],
      [
        { tipo: "diario", itemId: "broken", form: "{" },
        { tipo: "diario", itemId: "different-id", form: JSON.stringify({ id: "actual-id" }) },
      ],
      "diario",
    );

    expect(merged).toEqual([]);
    expect(console.warn).toHaveBeenCalledTimes(2);
  });
});
