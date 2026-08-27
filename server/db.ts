import { eq, and, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  InsertUser,
  users,
  subscriptions,
  paymentTransactions,
  cardTokens,
  pcaDocuments,
  importedFormatDocuments,
  formatoPlantillas,
  InsertSubscription,
  InsertPaymentTransaction,
  InsertCardToken,
  InsertPcaDocument,
  InsertImportedFormatDocument,
  InsertFormatoPlantilla,
  // Bachillerato Técnico
  btAreasTecnicas,
  btFamiliasProfesionales,
  btFigurasProfesionales,
  btModulosFormativos,
  btContenidos,
  btResultadosAprendizaje,
  btCriteriosEvaluacion,
  btModuloPorAnio,
  btPlanificaciones,
  btDistribucionTrimestre,
} from "../drizzle/schema";
import { ENV } from "./_core/env";

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = "admin";
      updateSet.role = "admin";
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// ============= Subscription Queries =============

/**
 * Get the active subscription for an email address.
 * Returns the most recent active subscription if any.
 */
export async function getActiveSubscription(email: string) {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.email, email.toLowerCase()),
        eq(subscriptions.status, "active")
      )
    )
    .orderBy(desc(subscriptions.endDate))
    .limit(1);

  if (result.length === 0) return null;

  const sub = result[0];
  // Check if subscription has expired
  if (new Date(sub.endDate) < now) {
    // Mark as expired
    await db
      .update(subscriptions)
      .set({ status: "expired" })
      .where(eq(subscriptions.id, sub.id));
    return null;
  }

  return sub;
}

/**
 * Create a new subscription after successful payment.
 */
export async function createSubscription(data: InsertSubscription) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(subscriptions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
  return result[0].insertId;
}

// ============= Payment Transaction Queries =============

/**
 * Create a pending payment transaction.
 */
export async function createPaymentTransaction(data: InsertPaymentTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db.insert(paymentTransactions).values({
    ...data,
    email: data.email.toLowerCase(),
  });
}

/**
 * Get a payment transaction by clientTransactionId.
 */
export async function getPaymentTransaction(clientTransactionId: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(paymentTransactions)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update a payment transaction after PayPhone confirmation.
 */
export async function updatePaymentTransaction(
  clientTransactionId: string,
  data: {
    payphoneTransactionId?: number;
    status: "approved" | "cancelled" | "error";
    statusCode?: number;
    authorizationCode?: string;
    cardType?: string;
    cardBrand?: string;
    lastDigits?: string;
    payphoneResponse?: string;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(paymentTransactions)
    .set(data)
    .where(eq(paymentTransactions.clientTransactionId, clientTransactionId));
}

/**
 * Count how many approved subscriptions an email has had (for promo pricing).
 */
export async function countPreviousSubscriptions(email: string): Promise<number> {
  const db = await getDb();
  if (!db) return 0;

  const result = await db
    .select()
    .from(subscriptions)
    .where(eq(subscriptions.email, email.toLowerCase()));

  return result.length;
}

// ============= Card Token Queries =============

/**
 * Save or update a card token for recurring billing.
 * Deactivates any previous tokens for the same email.
 */
export async function saveCardToken(data: InsertCardToken): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Deactivate previous tokens for this email
  await db
    .update(cardTokens)
    .set({ isActive: false })
    .where(eq(cardTokens.email, data.email.toLowerCase()));

  // Insert new token
  const result = await db.insert(cardTokens).values({
    ...data,
    email: data.email.toLowerCase(),
  });
  return result[0].insertId;
}

/**
 * Get the active card token for an email.
 */
export async function getActiveCardToken(email: string) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(cardTokens)
    .where(
      and(
        eq(cardTokens.email, email.toLowerCase()),
        eq(cardTokens.isActive, true)
      )
    )
    .orderBy(desc(cardTokens.createdAt))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all subscriptions that are due for renewal (expired or about to expire).
 * Returns active recurring subscriptions whose endDate has passed.
 */
export async function getSubscriptionsDueForRenewal() {
  const db = await getDb();
  if (!db) return [];

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.isRecurring, true),
        eq(subscriptions.status, "active")
      )
    );

  // Filter those whose endDate has passed
  return result.filter((sub) => new Date(sub.endDate) <= now);
}

/**
 * Get subscriptions in past_due status (grace period).
 */
export async function getPastDueSubscriptions() {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.isRecurring, true),
        eq(subscriptions.status, "past_due")
      )
    );
}

/**
 * Update subscription status and charge attempt info.
 */
export async function updateSubscriptionChargeStatus(
  id: number,
  data: {
    status?: "active" | "expired" | "cancelled" | "past_due";
    failedChargeAttempts?: number;
    lastChargeAttempt?: Date;
    endDate?: Date;
    transactionId?: string;
    authorizationCode?: string;
    amountPaid?: number;
  }
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(subscriptions)
    .set(data)
    .where(eq(subscriptions.id, id));
}

/**
 * Deactivate a card token (e.g., after too many failures).
 */
export async function deactivateCardToken(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(cardTokens)
    .set({ isActive: false })
    .where(eq(cardTokens.id, id));
}

// ============= PCA Document Queries =============

/**
 * Crea la tabla pca_documents si no existe.
 * Se llama antes de cualquier operación PCA para garantizar que la tabla está presente
 * incluso si la migración no se ejecutó durante el build.
 */
async function ensurePcaTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    // sql`` from drizzle-orm/mysql2 allows raw SQL execution
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`pca_documents\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sessionId\` varchar(320) NOT NULL,
        \`status\` enum('draft','generated','paid') NOT NULL DEFAULT 'draft',
        \`formData\` text NOT NULL,
        \`aiResult\` text,
        \`clientTransactionId\` varchar(64) DEFAULT NULL,
        \`payphoneTransactionId\` int DEFAULT NULL,
        \`authorizationCode\` varchar(64) DEFAULT NULL,
        \`amountPaid\` int DEFAULT NULL,
        \`formatoPlantillaId\` int DEFAULT NULL,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_pca_sessionId\` (\`sessionId\`),
        KEY \`idx_pca_clientTxId\` (\`clientTransactionId\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);

    // Agregar columna formatoPlantillaId si no existe (migración para tablas existentes)
    const [colCheck] = await (db as any).execute(`
      SELECT COUNT(*) AS cnt FROM information_schema.columns
      WHERE table_schema = DATABASE()
        AND table_name = 'pca_documents'
        AND column_name = 'formatoPlantillaId'
    `);
    if (colCheck?.[0]?.cnt === 0) {
      await (db as any).execute(
        `ALTER TABLE \`pca_documents\` ADD COLUMN \`formatoPlantillaId\` INT AFTER \`amountPaid\``
      );
    }
  } catch (err: any) {
    // Si ya existe o hay otro error no crítico, continuar
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensurePcaTable warning:", err?.message);
    }
  }
}

/**
 * Create a new PCA document (status=draft or generated).
 */
export async function createPcaDocument(data: {
  sessionId: string;
  status: "draft" | "generated" | "paid";
  formData: string;
  aiResult?: string | null;
  formatoPlantillaId?: number | null;
}): Promise<number> {
  await ensurePcaTable();

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(pcaDocuments).values({
    sessionId: data.sessionId,
    status: data.status,
    formData: data.formData,
    aiResult: data.aiResult ?? null,
    formatoPlantillaId: data.formatoPlantillaId ?? null,
  } as InsertPcaDocument);
  return result[0].insertId;
}

/**
 * Get a PCA document by ID.
 */
export async function getPcaDocument(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select({
      id: pcaDocuments.id,
      sessionId: pcaDocuments.sessionId,
      status: pcaDocuments.status,
      formData: pcaDocuments.formData,
      aiResult: pcaDocuments.aiResult,
      clientTransactionId: pcaDocuments.clientTransactionId,
      payphoneTransactionId: pcaDocuments.payphoneTransactionId,
      authorizationCode: pcaDocuments.authorizationCode,
      amountPaid: pcaDocuments.amountPaid,
      formatoPlantillaId: pcaDocuments.formatoPlantillaId,
      createdAt: pcaDocuments.createdAt,
      updatedAt: pcaDocuments.updatedAt,
    })
    .from(pcaDocuments)
    .where(eq(pcaDocuments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Update the AI result and mark as generated.
 */
export async function setPcaAiResult(id: number, aiResult: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ status: "generated", aiResult })
    .where(eq(pcaDocuments.id, id));
}

/**
 * Store the PayPhone clientTransactionId when the docente initiates payment.
 */
export async function setPcaClientTxId(id: number, clientTransactionId: string): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ clientTransactionId })
    .where(eq(pcaDocuments.id, id));
}

/**
 * Mark a PCA document as paid after successful PayPhone confirmation.
 */
export async function unlockPcaDocument(data: {
  clientTransactionId: string;
  payphoneTransactionId: number;
  authorizationCode: string;
  amountPaid: number;
}): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({
      status: "paid",
      payphoneTransactionId: data.payphoneTransactionId,
      authorizationCode: data.authorizationCode,
      amountPaid: data.amountPaid,
    })
    .where(eq(pcaDocuments.clientTransactionId, data.clientTransactionId));
}

/**
 * Get all PCA documents for a session (email/deviceId).
 */
export async function getPcaDocumentsBySession(sessionId: string) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select()
    .from(pcaDocuments)
    .where(eq(pcaDocuments.sessionId, sessionId))
    .orderBy(desc(pcaDocuments.createdAt));
}

/**
 * Mark a PCA document as paid without charging (for annual subscribers).
 * amountPaid is set to 0 to distinguish from a real PayPhone payment.
 */
export async function setPcaStatusPaidFree(id: number): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ status: "paid", amountPaid: 0 })
    .where(eq(pcaDocuments.id, id));
}

/**
 * Returns the active annual subscription for an email, or null if none.
 * Used to auto-unlock PCA/PCT documents for annual plan subscribers.
 */
export async function getActiveAnnualSubscription(email: string) {
  const db = await getDb();
  if (!db) return null;

  const now = new Date();
  const result = await db
    .select()
    .from(subscriptions)
    .where(
      and(
        eq(subscriptions.email, email.toLowerCase()),
        eq(subscriptions.status, "active"),
        eq(subscriptions.plan, "annual")
      )
    )
    .orderBy(desc(subscriptions.endDate))
    .limit(1);

  if (result.length === 0) return null;

  const sub = result[0];
  if (new Date(sub.endDate) < now) return null;

  return sub;
}

/**
 * Reemplaza formData y aiResult de una PCA existente y la marca "generated"
 * — usado al completar una importación sobre una PCA ya guardada por el
 * mismo docente (ver server/importar-formato-router.ts).
 */
export async function updatePcaFormDataAndAiResult(
  id: number,
  formData: string,
  aiResult: string
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ status: "generated", formData, aiResult })
    .where(eq(pcaDocuments.id, id));
}

/**
 * Actualiza el formatoPlantillaId de un PCA existente.
 */
export async function setPcaFormatoPlantillaId(
  pcaId: number,
  formatoPlantillaId: number | null
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(pcaDocuments)
    .set({ formatoPlantillaId })
    .where(eq(pcaDocuments.id, pcaId));
}

/**
 * Defensive runtime creation for imported_format_documents — igual patrón que
 * ensurePcaTable: si la migración 0009 no se aplicó aún en la BD desplegada,
 * la tabla se crea sola en el primer uso.
 */
async function ensureImportedFormatDocumentsTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`imported_format_documents\` (
        \`id\` int NOT NULL AUTO_INCREMENT,
        \`sessionId\` varchar(320) NOT NULL,
        \`fileName\` varchar(255) NOT NULL,
        \`mimeType\` varchar(128) NOT NULL,
        \`storageKey\` varchar(512) DEFAULT NULL,
        \`tipoDetectado\` varchar(32) DEFAULT NULL,
        \`camposExtraidos\` text,
        \`resultado\` text,
        \`planificacionId\` int DEFAULT NULL,
        \`status\` enum('subido','analizando','completado','error','ambiguo') NOT NULL DEFAULT 'subido',
        \`errorMensaje\` text,
        \`createdAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        KEY \`idx_imported_session\` (\`sessionId\`),
        KEY \`idx_imported_status\` (\`status\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4
    `);
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureImportedFormatDocumentsTable warning:", err?.message);
    }
  }
}

/**
 * Ensure formato_plantillas table exists and templateBufferBase64 is LONGTEXT.
 * Fixes the issue where TEXT column truncated DOCX files with embedded images.
 */
async function ensureFormatoPlantillaTable(): Promise<void> {
  const db = await getDb();
  if (!db) return;

  try {
    await (db as any).execute(`
      CREATE TABLE IF NOT EXISTS \`formato_plantillas\` (
        \`id\`                 INT           NOT NULL AUTO_INCREMENT,
        \`sessionId\`          VARCHAR(320)  NOT NULL,
        \`nombre\`             VARCHAR(255)  NOT NULL,
        \`tipoPlanificacion\`  VARCHAR(32)   NOT NULL,
        \`formatoOrigen\`      VARCHAR(16)   NOT NULL,
        \`mimeType\`           VARCHAR(128)  NOT NULL,
        \`storageKey\`         VARCHAR(512)  NOT NULL,
        \`templateBufferBase64\` LONGTEXT,
        \`version\`            INT           NOT NULL DEFAULT 1,
        \`estructura\`         TEXT          NOT NULL,
        \`bindings\`           TEXT          NOT NULL,
        \`configuracion\`      TEXT,
        \`activo\`             BOOLEAN       NOT NULL DEFAULT TRUE,
        \`createdAt\`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
        \`updatedAt\`          TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (\`id\`),
        INDEX \`idx_plantilla_session\` (\`sessionId\`),
        INDEX \`idx_plantilla_tipo\` (\`tipoPlanificacion\`)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `);

    // Migrate existing TEXT column to LONGTEXT if needed (DOCX with images exceed 64KB)
    // Try ALTER directly — if column is already LONGTEXT, error is caught and ignored
    try {
      await (db as any).execute(
        `ALTER TABLE \`formato_plantillas\` MODIFY COLUMN \`templateBufferBase64\` LONGTEXT`
      );
    } catch (e: any) {
      // Column might already be LONGTEXT or table might not exist yet — safe to ignore
    }
  } catch (err: any) {
    if (!err?.message?.includes("already exists")) {
      console.warn("[DB] ensureFormatoPlantillaTable warning:", err?.message);
    }
  }
}

/**
 * Crea el registro inicial de una importación de formato (status "subido").
 */
export async function createImportedFormatDocument(data: {
  sessionId: string;
  fileName: string;
  mimeType: string;
  storageKey?: string | null;
}): Promise<number> {
  await ensureImportedFormatDocumentsTable();

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(importedFormatDocuments).values({
    sessionId: data.sessionId,
    fileName: data.fileName,
    mimeType: data.mimeType,
    storageKey: data.storageKey ?? null,
    status: "subido",
  } as InsertImportedFormatDocument);
  return result[0].insertId;
}

/**
 * Actualiza el estado/resultado de una importación en curso.
 */
export async function updateImportedFormatDocument(
  id: number,
  data: Partial<{
    status: "subido" | "analizando" | "completado" | "error" | "ambiguo";
    tipoDetectado: string | null;
    camposExtraidos: string | null;
    resultado: string | null;
    planificacionId: number | null;
    errorMensaje: string | null;
  }>
): Promise<void> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(importedFormatDocuments)
    .set(data)
    .where(eq(importedFormatDocuments.id, id));
}

/**
 * Obtiene una importación por ID.
 */
export async function getImportedFormatDocument(id: number) {
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(importedFormatDocuments)
    .where(eq(importedFormatDocuments.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Busca planificaciones PCA existentes de una sesión que coincidan con el
 * área/grado/año lectivo detectados en un documento importado — usadas como
 * fuente de datos para completar campos vacíos (ver design.md, Decisión 6).
 */
export async function findMatchingPcaDocuments(data: {
  sessionId: string;
  area?: string;
  grado?: string;
  anioLectivo?: string;
}) {
  const db = await getDb();
  if (!db) return [];

  const rows = await db
    .select({
      id: pcaDocuments.id,
      sessionId: pcaDocuments.sessionId,
      status: pcaDocuments.status,
      formData: pcaDocuments.formData,
      aiResult: pcaDocuments.aiResult,
      clientTransactionId: pcaDocuments.clientTransactionId,
      payphoneTransactionId: pcaDocuments.payphoneTransactionId,
      authorizationCode: pcaDocuments.authorizationCode,
      amountPaid: pcaDocuments.amountPaid,
      formatoPlantillaId: pcaDocuments.formatoPlantillaId,
      createdAt: pcaDocuments.createdAt,
      updatedAt: pcaDocuments.updatedAt,
    })
    .from(pcaDocuments)
    .where(eq(pcaDocuments.sessionId, data.sessionId))
    .orderBy(desc(pcaDocuments.createdAt));

  return rows.filter((row) => {
    try {
      const formData = JSON.parse(row.formData);
      if (data.area && formData.area !== data.area) return false;
      if (data.grado && formData.grado !== data.grado) return false;
      if (data.anioLectivo && formData.anioLectivo !== data.anioLectivo) return false;
      return true;
    } catch {
      return false;
    }
  });
}

// ─── Formato Plantillas ─────────────────────────────────────────────────────

/**
 * Crea una nueva plantilla de formato derivada de un documento importado.
 */
export async function createFormatoPlantilla(data: {
  sessionId: string;
  nombre: string;
  tipoPlanificacion: string;
  formatoOrigen: string;
  mimeType: string;
  storageKey: string;
  estructura: string;
  bindings: string;
  configuracion?: string;
  templateBufferBase64?: string;
}): Promise<number> {
  await ensureFormatoPlantillaTable();

  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(formatoPlantillas).values({
    sessionId: data.sessionId,
    nombre: data.nombre,
    tipoPlanificacion: data.tipoPlanificacion,
    formatoOrigen: data.formatoOrigen,
    mimeType: data.mimeType,
    storageKey: data.storageKey,
    estructura: data.estructura,
    bindings: data.bindings,
    configuracion: data.configuracion ?? null,
    templateBufferBase64: data.templateBufferBase64 ?? null,
    version: 1,
    activo: true,
  } as InsertFormatoPlantilla);

  return result[0].insertId;
}

/**
 * Obtiene una plantilla por ID.
 */
export async function getFormatoPlantilla(id: number) {
  await ensureFormatoPlantillaTable();
  const db = await getDb();
  if (!db) return null;

  const result = await db
    .select()
    .from(formatoPlantillas)
    .where(eq(formatoPlantillas.id, id))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Lista todas las plantillas activas de una sesión para un tipo dado.
 */
export async function listFormatoPlantillas(
  sessionId: string,
  tipoPlanificacion?: string
) {
  await ensureFormatoPlantillaTable();
  const db = await getDb();
  if (!db) return [];

  const conditions = [
    eq(formatoPlantillas.sessionId, sessionId),
    eq(formatoPlantillas.activo, true),
  ];

  if (tipoPlanificacion) {
    conditions.push(eq(formatoPlantillas.tipoPlanificacion, tipoPlanificacion));
  }

  return db
    .select()
    .from(formatoPlantillas)
    .where(and(...conditions))
    .orderBy(desc(formatoPlantillas.createdAt));
}

/**
 * Clona un documento PCA existente.
 * Crea una copia con los mismos datos pero status "draft" y nueva sesión.
 * Preserva formData, aiResult y formatoPlantillaId.
 */
export async function clonePcaDocument(
  sourceId: number,
  newSessionId: string
): Promise<number> {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Obtener documento fuente
  const source = await getPcaDocument(sourceId);
  if (!source) throw new Error("Documento PCA fuente no encontrado");

  // Crear nuevo documento con los mismos datos
  const result = await db.insert(pcaDocuments).values({
    sessionId: newSessionId,
    status: "draft",
    formData: source.formData,
    aiResult: source.aiResult,
    formatoPlantillaId: (source as any).formatoPlantillaId ?? null,
  } as InsertPcaDocument);

  return result[0].insertId;
}

// ═══════════════════════════════════════════════════════════════════════════
// Bachillerato Técnico — Funciones de acceso a datos
// ═══════════════════════════════════════════════════════════════════════════

// ─── 5.1 Figuras Profesionales ───────────────────────────────────────────

export type BtFiguraConFamiliaArea = typeof btFigurasProfesionales.$inferSelect & {
  familia: typeof btFamiliasProfesionales.$inferSelect & {
    area: typeof btAreasTecnicas.$inferSelect;
  };
};

/**
 * Lista figuras profesionales con filtro opcional por área, familia y estado.
 */
export async function listBtFiguras(opts?: {
  areaId?: number;
  familiaId?: number;
  activa?: boolean;
}): Promise<BtFiguraConFamiliaArea[]> {
  const db = await getDb();
  if (!db) return [];

  const conditions: any[] = [];
  if (opts?.activa !== undefined) {
    conditions.push(eq(btFigurasProfesionales.activa, opts.activa));
  }

  const rows = await db
    .select({
      figura: btFigurasProfesionales,
      familia: btFamiliasProfesionales,
      area: btAreasTecnicas,
    })
    .from(btFigurasProfesionales)
    .innerJoin(
      btFamiliasProfesionales,
      eq(btFigurasProfesionales.familiaId, btFamiliasProfesionales.id)
    )
    .innerJoin(
      btAreasTecnicas,
      eq(btFamiliasProfesionales.areaId, btAreasTecnicas.id)
    )
    .where(conditions.length > 0 ? and(...conditions) : undefined);

  // Filtrar por área/familia post-join (Drizzle no permite alias de join fácilmente)
  return rows
    .filter((r) => {
      if (opts?.areaId && r.familia.areaId !== opts.areaId) return false;
      if (opts?.familiaId && r.figura.familiaId !== opts.familiaId) return false;
      return true;
    })
    .map((r) => ({
      ...r.figura,
      familia: { ...r.familia, area: r.area },
    }));
}

/**
 * Obtiene una figura profesional por ID con su familia y área.
 */
export async function getBtFiguraById(
  id: number
): Promise<BtFiguraConFamiliaArea | null> {
  const db = await getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      figura: btFigurasProfesionales,
      familia: btFamiliasProfesionales,
      area: btAreasTecnicas,
    })
    .from(btFigurasProfesionales)
    .innerJoin(
      btFamiliasProfesionales,
      eq(btFigurasProfesionales.familiaId, btFamiliasProfesionales.id)
    )
    .innerJoin(
      btAreasTecnicas,
      eq(btFamiliasProfesionales.areaId, btAreasTecnicas.id)
    )
    .where(eq(btFigurasProfesionales.id, id))
    .limit(1);

  if (!row) return null;
  return {
    ...row.figura,
    familia: { ...row.familia, area: row.area },
  };
}

/**
 * Obtiene una figura profesional por código.
 */
export async function getBtFiguraByCodigo(
  codigo: string
): Promise<BtFiguraConFamiliaArea | null> {
  const db = await getDb();
  if (!db) return null;

  const [row] = await db
    .select({
      figura: btFigurasProfesionales,
      familia: btFamiliasProfesionales,
      area: btAreasTecnicas,
    })
    .from(btFigurasProfesionales)
    .innerJoin(
      btFamiliasProfesionales,
      eq(btFigurasProfesionales.familiaId, btFamiliasProfesionales.id)
    )
    .innerJoin(
      btAreasTecnicas,
      eq(btFamiliasProfesionales.areaId, btAreasTecnicas.id)
    )
    .where(eq(btFigurasProfesionales.codigo, codigo))
    .limit(1);

  if (!row) return null;
  return {
    ...row.figura,
    familia: { ...row.familia, area: row.area },
  };
}

// ─── 5.2 Áreas y Familias ────────────────────────────────────────────────

/**
 * Lista todas las áreas técnicas.
 */
export async function listBtAreas() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(btAreasTecnicas);
}

/**
 * Lista familias profesionales de un área.
 */
export async function listBtFamiliasByArea(areaId: number) {
  const db = await getDb();
  if (!db) return [];
  return db
    .select()
    .from(btFamiliasProfesionales)
    .where(eq(btFamiliasProfesionales.areaId, areaId));
}

/**
 * Navegación completa: Área → Familia → Figura.
 */
export async function getBtCatalogoCompleto() {
  const db = await getDb();
  if (!db) return [];

  const areas = await db.select().from(btAreasTecnicas);
  const familias = await db.select().from(btFamiliasProfesionales);
  const figuras = await db
    .select()
    .from(btFigurasProfesionales)
    .where(eq(btFigurasProfesionales.activa, true));

  return areas.map((area) => ({
    ...area,
    familias: familias
      .filter((f) => f.areaId === area.id)
      .map((familia) => ({
        ...familia,
        figuras: figuras.filter((fig) => fig.familiaId === familia.id),
      })),
  }));
}

// ─── 5.3 Módulos Formativos ──────────────────────────────────────────────

/**
 * Módulos de una figura profesional con distribución por año.
 */
export async function getBtModulosPorFigura(figuraId: number) {
  const db = await getDb();
  if (!db) return [];

  const modulos = await db
    .select()
    .from(btModulosFormativos)
    .where(eq(btModulosFormativos.figuraId, figuraId));

  const distribucion = modulos.length
    ? await db
        .select()
        .from(btModuloPorAnio)
        .where(
          and(
            ...modulos.map((m) => eq(btModuloPorAnio.moduloId, m.id))
          )
        )
    : [];

  return modulos.map((modulo) => ({
    ...modulo,
    distribucionAnual: distribucion.filter((d) => d.moduloId === modulo.id),
  }));
}

/**
 * Módulos por año BGU (1, 2, 3) con carga horaria.
 */
export async function getBtModulosPorAnio(
  figuraId: number,
  anioBGU: 1 | 2 | 3
) {
  const db = await getDb();
  if (!db) return [];

  return db
    .select({
      modulo: btModulosFormativos,
      cargaHoraria: btModuloPorAnio.cargaHorariaSemanal,
    })
    .from(btModulosFormativos)
    .innerJoin(
      btModuloPorAnio,
      eq(btModulosFormativos.id, btModuloPorAnio.moduloId)
    )
    .where(
      and(
        eq(btModulosFormativos.figuraId, figuraId),
        eq(btModuloPorAnio.anioBGU, anioBGU)
      )
    );
}

// ─── 5.4 Currículo del Módulo ────────────────────────────────────────────

/**
 * Currículo completo de un módulo: contenidos, RA y CE.
 */
export async function getBtCurriculumModulo(moduloId: number) {
  const db = await getDb();
  if (!db) return null;

  const modulo = await db
    .select()
    .from(btModulosFormativos)
    .where(eq(btModulosFormativos.id, moduloId))
    .limit(1);

  if (!modulo.length) return null;

  const contenidos = await db
    .select()
    .from(btContenidos)
    .where(eq(btContenidos.moduloId, moduloId))
    .orderBy(btContenidos.orden);

  const ra = await db
    .select()
    .from(btResultadosAprendizaje)
    .where(eq(btResultadosAprendizaje.moduloId, moduloId));

  const ce = ra.length
    ? await db
        .select()
        .from(btCriteriosEvaluacion)
        .where(
          and(
            ...ra.map((r) => eq(btCriteriosEvaluacion.raId, r.id))
          )
        )
    : [];

  const distribucion = await db
    .select()
    .from(btModuloPorAnio)
    .where(eq(btModuloPorAnio.moduloId, moduloId));

  return {
    ...modulo[0],
    contenidos,
    resultadosAprendizaje: ra.map((r) => ({
      ...r,
      criteriosEvaluacion: ce.filter((c) => c.raId === r.id),
    })),
    distribucionAnual: distribucion,
  };
}

/**
 * Contenidos de un módulo filtrados por tipo (opcional).
 */
export async function getBtContenidosPorModulo(
  moduloId: number,
  tipo?: "conceptual" | "procedimental" | "actitudinal"
) {
  const db = await getDb();
  if (!db) return [];

  const conditions = [eq(btContenidos.moduloId, moduloId)];
  if (tipo) {
    conditions.push(eq(btContenidos.tipo, tipo));
  }

  return db
    .select()
    .from(btContenidos)
    .where(and(...conditions))
    .orderBy(btContenidos.orden);
}

/**
 * RA de un módulo con sus CE.
 */
export async function getBtRAPorModulo(moduloId: number) {
  const db = await getDb();
  if (!db) return [];

  const ra = await db
    .select()
    .from(btResultadosAprendizaje)
    .where(eq(btResultadosAprendizaje.moduloId, moduloId));

  const ce = ra.length
    ? await db
        .select()
        .from(btCriteriosEvaluacion)
        .where(
          and(
            ...ra.map((r) => eq(btCriteriosEvaluacion.raId, r.id))
          )
        )
    : [];

  return ra.map((r) => ({
    ...r,
    criteriosEvaluacion: ce.filter((c) => c.raId === r.id),
  }));
}

// ─── 5.5 Planificaciones ─────────────────────────────────────────────────

/**
 * Obtiene una planificación por ID con distribución completa.
 */
export async function getBtPlanificacion(planificacionId: number) {
  const db = await getDb();
  if (!db) return null;

  const [plan] = await db
    .select()
    .from(btPlanificaciones)
    .where(eq(btPlanificaciones.id, planificacionId))
    .limit(1);

  if (!plan) return null;

  const distribucion = await db
    .select()
    .from(btDistribucionTrimestre)
    .where(eq(btDistribucionTrimestre.planificacionId, planificacionId));

  // Enriquecer con datos del catálogo
  const distribucionEnriquecida = await Promise.all(
    distribucion.map(async (d) => {
      let contenido = null;
      let ra = null;

      if (d.contenidoId) {
        const [c] = await db
          .select()
          .from(btContenidos)
          .where(eq(btContenidos.id, d.contenidoId))
          .limit(1);
        contenido = c || null;
      }

      if (d.raId) {
        const [r] = await db
          .select()
          .from(btResultadosAprendizaje)
          .where(eq(btResultadosAprendizaje.id, d.raId))
          .limit(1);
        ra = r || null;
      }

      return { ...d, contenido, ra };
    })
  );

  // Obtener figura completa
  const figura = await getBtFiguraById(plan.figuraId);

  return {
    ...plan,
    figura,
    distribucion: distribucionEnriquecida,
  };
}

/**
 * Crea una nueva planificación BT.
 */
export async function createBtPlanificacion(data: {
  sessionId: string;
  figuraId: number;
  anioBGU: 1 | 2 | 3;
  anioLectivo: string;
  nombre: string;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(btPlanificaciones).values({
    sessionId: data.sessionId,
    figuraId: data.figuraId,
    anioBGU: data.anioBGU,
    anioLectivo: data.anioLectivo,
    nombre: data.nombre,
  });

  return result[0].insertId;
}

/**
 * Actualiza una planificación BT.
 */
export async function updateBtPlanificacion(
  planificacionId: number,
  data: Partial<{
    nombre: string;
    figuraId: number;
    anioBGU: 1 | 2 | 3;
    anioLectivo: string;
  }>
) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .update(btPlanificaciones)
    .set(data)
    .where(eq(btPlanificaciones.id, planificacionId));
}

/**
 * Elimina una planificación BT y su distribución.
 */
export async function deleteBtPlanificacion(planificacionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  // Eliminar distribución primero (FK constraint)
  await db
    .delete(btDistribucionTrimestre)
    .where(eq(btDistribucionTrimestre.planificacionId, planificacionId));

  // Eliminar planificación
  await db
    .delete(btPlanificaciones)
    .where(eq(btPlanificaciones.id, planificacionId));
}

/**
 * Agrega un contenido a un trimestre de una planificación.
 */
export async function addBtDistribucionTrimestre(data: {
  planificacionId: number;
  trimestre: 1 | 2 | 3;
  contenidoId?: number;
  raId?: number;
}) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  const result = await db.insert(btDistribucionTrimestre).values({
    planificacionId: data.planificacionId,
    trimestre: data.trimestre,
    contenidoId: data.contenidoId || null,
    raId: data.raId || null,
  });

  return result[0].insertId;
}

/**
 * Elimina una distribución trimestral.
 */
export async function removeBtDistribucionTrimestre(distribucionId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");

  await db
    .delete(btDistribucionTrimestre)
    .where(eq(btDistribucionTrimestre.id, distribucionId));
}

/**
 * Resumen de carga horaria por trimestre para una planificación.
 * Usa la carga horaria oficial de btModuloPorAnio, no cuenta filas.
 */
export async function getBtResumenCargaHoraria(planificacionId: number) {
  const plan = await getBtPlanificacion(planificacionId);
  if (!plan) return null;

  const db = await getDb();
  if (!db) return null;

  // Obtener módulos únicos involucrados en la distribución
  const moduloIds = new Set<number>();
  for (const d of plan.distribucion) {
    if (d.contenidoId) {
      const [contenido] = await db
        .select({ moduloId: btContenidos.moduloId })
        .from(btContenidos)
        .where(eq(btContenidos.id, d.contenidoId))
        .limit(1);
      if (contenido) moduloIds.add(contenido.moduloId);
    }
  }

  // Para cada módulo, obtener su carga horaria oficial
  let cargaHorariaTotal = 0;
  const modulosConCarga: Array<{
    moduloId: number;
    cargaHorariaSemanal: number;
    trimestres: number[];
  }> = [];

  for (const moduloId of moduloIds) {
    const [modPorAnio] = await db
      .select()
      .from(btModuloPorAnio)
      .where(
        and(
          eq(btModuloPorAnio.moduloId, moduloId),
          eq(btModuloPorAnio.anioBGU, plan.anioBGU)
        )
      )
      .limit(1);

    if (modPorAnio) {
      // Encontrar en qué trimestres está distribuido este módulo
      const trimestresModulo = plan.distribucion
        .filter((d) => {
          if (!d.contenidoId) return false;
          // Verificar si este contenido pertenece al módulo
          return plan.distribucion.some(
            (dd) => dd.id === d.id && dd.contenidoId === d.contenidoId
          );
        })
        .map((d) => d.trimestre);

      const trimestresUnicos = [...new Set(trimestresModulo)];

      modulosConCarga.push({
        moduloId,
        cargaHorariaSemanal: modPorAnio.cargaHorariaSemanal,
        trimestres: trimestresUnicos,
      });

      // Sumar carga horaria total (una vez por módulo, no por trimestre)
      cargaHorariaTotal += modPorAnio.cargaHorariaSemanal;
    }
  }

  // Calcular carga por trimestre basada en módulos asignados
  const porTrimestre: Record<number, number> = { 1: 0, 2: 0, 3: 0 };
  for (const mc of modulosConCarga) {
    // Distribuir carga horaria equitativamente entre los trimestres del módulo
    const cargaPorTrimestre = mc.cargaHorariaSemanal / mc.trimestres.length;
    for (const t of mc.trimestres) {
      porTrimestre[t] += cargaPorTrimestre;
    }
  }

  return {
    planificacionId,
    anioBGU: plan.anioBGU,
    trimestres: [
      { trimestre: 1, cargaHoraria: Math.round(porTrimestre[1] * 10) / 10 },
      { trimestre: 2, cargaHoraria: Math.round(porTrimestre[2] * 10) / 10 },
      { trimestre: 3, cargaHoraria: Math.round(porTrimestre[3] * 10) / 10 },
    ],
    totalSemanal: Math.round((cargaHorariaTotal / 3) * 10) / 10,
    modulosIncluidos: modulosConCarga,
  };
}
