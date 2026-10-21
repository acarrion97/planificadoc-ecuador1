import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

vi.mock("../api/_lib/admin-auth", () => ({
  handleCors: vi.fn(() => false),
  verifyAdmin: vi.fn(() => true),
}));

vi.mock("../api/_lib/db", () => ({
  getDb: vi.fn(),
  createSubscription: vi.fn(),
}));

vi.mock("../server/email", () => ({
  sendRenewalReminderEmail: vi.fn(),
  sendExpiredEmail: vi.fn(),
  sendPromoReactivacionEmail: vi.fn(),
  sendResubscribeEmail: vi.fn(),
}));

import { getDb } from "../api/_lib/db";
import handler from "../api/admin/[action]";

type SubFila = {
  id: number;
  email: string;
  plan: string;
  status: string;
  amountPaid: number;
  startDate: Date;
  endDate: Date;
  isRecurring: boolean;
  isTrial: boolean;
  failedChargeAttempts: number;
};

function fakeDb(subs: SubFila[], cuentas: { id: number; email: string; nombre: string }[]) {
  const calls = {
    insert: [] as any[],
    update: [] as any[],
    execute: 0,
  };

  const db = {
    execute: vi.fn(async () => {
      calls.execute++;
      return {};
    }),
    insert: vi.fn(() => ({
      values: vi.fn(async (values: any) => {
        calls.insert.push(values);
        return { insertId: 99 };
      }),
    })),
    update: vi.fn(() => ({
      set: vi.fn((values: any) => {
        calls.update.push(values);
        return { where: vi.fn(async () => ({})) };
      }),
    })),
    select: vi.fn(() => ({
      from: vi.fn(() => ({
        where: vi.fn(() => ({
          orderBy: vi.fn(async () => subs),
          limit: vi.fn(async () => cuentas),
        })),
      })),
    })),
  };

  return { db, calls };
}

function fakeRes() {
  const res: any = {
    statusCode: 200,
    body: undefined as any,
    status(code: number) {
      res.statusCode = code;
      return res;
    },
    json(payload: any) {
      res.body = payload;
      return res;
    },
    setHeader() {
      return res;
    },
    send(payload: any) {
      res.body = payload;
      return res;
    },
    redirect() {
      return res;
    },
    end() {
      return res;
    },
  };
  return res;
}

async function callAdmin(body: any, method = "POST") {
  const res = fakeRes();
  await handler({ query: { action: "reactivate-access" }, method, body } as any, res as any);
  return res;
}

describe("Admin reactivate-access", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-07-18T12:00:00Z"));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("exige email", async () => {
    (getDb as any).mockReturnValue(fakeDb([], []).db);
    const res = await callAdmin({ months: 1 });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("email");
  });

  it("exige una duracion (meses o dias)", async () => {
    (getDb as any).mockReturnValue(fakeDb([], []).db);
    const res = await callAdmin({ email: "a@b.com" });
    expect(res.statusCode).toBe(400);
    expect(res.body.error).toContain("duracion");
  });

  it("reactivar 1 mes exacto mantiene el mismo dia del mes siguiente", async () => {
    const { db, calls } = fakeDb(
      [
        {
          id: 1,
          email: "merced8123@gmail.com",
          plan: "monthly",
          status: "expired",
          amountPaid: 0,
          startDate: new Date("2026-06-18T12:00:00Z"),
          endDate: new Date("2026-07-18T12:00:00Z"),
          isRecurring: false,
          isTrial: false,
          failedChargeAttempts: 0,
        },
      ],
      [{ id: 1, email: "merced8123@gmail.com", nombre: "Mercedes" }],
    );
    (getDb as any).mockReturnValue(db);

    const res = await callAdmin({ email: "merced8123@gmail.com", months: 1, password: "Mercedes2026" });

    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.previousStatus).toBe("expired");
    expect(res.body.passwordUpdated).toBe(true);
    expect(new Date(res.body.endDate).getUTCDate()).toBe(18);
    expect(new Date(res.body.endDate).getUTCMonth()).toBe(7); // agosto (0-indexado)
    expect(new Date(res.body.endDate).getUTCFullYear()).toBe(2026);

    // Cierra la suscripcion anterior y crea la nueva activa
    expect(calls.execute).toBe(1);
    expect(calls.insert).toHaveLength(1);
    expect(calls.insert[0].status).toBe("active");
    expect(calls.insert[0].isRecurring).toBe(false);
    expect(calls.insert[0].amountPaid).toBe(0);
    expect(calls.insert[0].plan).toBe("monthly");
  });

  it("modo extend suma al vencimiento vigente en lugar de reiniciar desde hoy", async () => {
    const { db, calls } = fakeDb(
      [
        {
          id: 1,
          email: "docente@ejemplo.com",
          plan: "monthly",
          status: "active",
          amountPaid: 699,
          startDate: new Date("2026-06-18T12:00:00Z"),
          endDate: new Date("2026-08-18T12:00:00Z"),
          isRecurring: true,
          isTrial: false,
          failedChargeAttempts: 0,
        },
      ],
      [{ id: 1, email: "docente@ejemplo.com", nombre: "Docente" }],
    );
    (getDb as any).mockReturnValue(db);

    const res = await callAdmin({ email: "docente@ejemplo.com", months: 1, mode: "extend" });

    expect(res.body.success).toBe(true);
    const end = new Date(res.body.endDate);
    expect(end.getUTCDate()).toBe(18);
    expect(end.getUTCMonth()).toBe(8); // septiembre
    expect(calls.insert[0].status).toBe("active");
  });

  it("recorta al ultimo dia del mes cuando el dia no existe (31-ene + 1 mes = 28-feb)", async () => {
    vi.setSystemTime(new Date("2026-01-31T12:00:00Z"));
    const { db } = fakeDb(
      [],
      [{ id: 1, email: "docente@ejemplo.com", nombre: "Docente" }],
    );
    (getDb as any).mockReturnValue(db);

    const res = await callAdmin({ email: "docente@ejemplo.com", months: 1 });

    const end = new Date(res.body.endDate);
    expect(end.getUTCDate()).toBe(28);
    expect(end.getUTCMonth()).toBe(1); // febrero
    expect(end.getUTCFullYear()).toBe(2026);
  });

  it("crea la cuenta si no existe y exige contraseña en ese caso", async () => {
    const { db, calls } = fakeDb([], []);
    (getDb as any).mockReturnValue(db);

    const sinPassword = await callAdmin({ email: "nuevo@ejemplo.com", months: 1 });
    expect(sinPassword.statusCode).toBe(400);
    expect(sinPassword.body.code).toBe("ACCOUNT_MISSING");

    const { db: db2, calls: calls2 } = fakeDb([], []);
    (getDb as any).mockReturnValue(db2);
    const conPassword = await callAdmin({ email: "nuevo@ejemplo.com", months: 1, password: "Clave123" });
    expect(conPassword.statusCode).toBe(200);
    expect(conPassword.body.accountCreated).toBe(true);
    expect(calls2.insert.some((c: any) => c.email === "nuevo@ejemplo.com")).toBe(true);
  });

  it("acepta dias en lugar de meses", async () => {
    const { db, calls } = fakeDb(
      [],
      [{ id: 1, email: "docente@ejemplo.com", nombre: "Docente" }],
    );
    (getDb as any).mockReturnValue(db);

    const res = await callAdmin({ email: "docente@ejemplo.com", days: 7 });

    expect(res.body.success).toBe(true);
    expect(res.body.durationDays).toBe(7);
    const end = new Date(res.body.endDate);
    expect(end.getUTCDate()).toBe(25); // 18 jul + 7 días
    expect(calls.insert[0].status).toBe("active");
  });
});
