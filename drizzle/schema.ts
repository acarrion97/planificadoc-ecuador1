import { int, longtext, mysqlEnum, mysqlTable, text, timestamp, varchar, boolean, uniqueIndex } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 */
export const users = mysqlTable("users", {
  id: int("id").autoincrement().primaryKey(),
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * Subscriptions table - tracks active subscriptions for users.
 * A user can have multiple subscription records (history), but only one active at a time.
 */
export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").autoincrement().primaryKey(),
  /** Email used for the subscription (primary identifier for non-OAuth users) */
  email: varchar("email", { length: 320 }).notNull(),
  /** Optional link to users table if user also has OAuth */
  userId: int("userId"),
  /** Subscription plan: 'monthly' or 'annual' */
  plan: varchar("plan", { length: 32 }).notNull().default("monthly"),
  /** Status: active, expired, cancelled, past_due (grace period), trial (3-day free trial) */
  status: mysqlEnum("status", ["active", "expired", "cancelled", "past_due", "trial"]).default("active").notNull(),
  /** Amount paid in cents */
  amountPaid: int("amountPaid").notNull(),
  /** PayPhone transaction ID */
  transactionId: varchar("transactionId", { length: 64 }),
  /** PayPhone authorization code */
  authorizationCode: varchar("authorizationCode", { length: 64 }),
  /** Start date of the subscription period */
  startDate: timestamp("startDate").defaultNow().notNull(),
  /** End date of the subscription period */
  endDate: timestamp("endDate").notNull(),
  /** Whether this is a promotional/introductory price */
  isPromo: boolean("isPromo").default(false).notNull(),
  /** Whether this subscription uses recurring billing */
  isRecurring: boolean("isRecurring").default(false).notNull(),
  /** Whether this is a 3-day free trial (card on file, charges after trialPlan period) */
  isTrial: boolean("isTrial").default(false).notNull(),
  /** Plan to charge when trial converts: 'monthly' | 'annual' */
  trialPlan: varchar("trialPlan", { length: 32 }),
  /** Card token ID reference for recurring billing */
  cardTokenId: int("cardTokenId"),
  /** Number of failed recurring charge attempts */
  failedChargeAttempts: int("failedChargeAttempts").default(0).notNull(),
  /** Last failed charge date */
  lastChargeAttempt: timestamp("lastChargeAttempt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Subscription = typeof subscriptions.$inferSelect;
export type InsertSubscription = typeof subscriptions.$inferInsert;

/**
 * Card tokens table - stores tokenized card data for recurring payments.
 * Each user (by email) can have one active token at a time.
 */
export const cardTokens = mysqlTable("card_tokens", {
  id: int("id").autoincrement().primaryKey(),
  /** Email of the card holder */
  email: varchar("email", { length: 320 }).notNull(),
  /** PayPhone card token (cToken) */
  cardToken: varchar("cardToken", { length: 255 }).notNull(),
  /** Card holder name */
  cardHolder: varchar("cardHolder", { length: 255 }).notNull(),
  /** Document ID (cédula) of the card holder */
  documentId: varchar("documentId", { length: 20 }).notNull(),
  /** Phone number of the card holder (format: 593XXXXXXXXX) */
  phoneNumber: varchar("phoneNumber", { length: 20 }).notNull(),
  /** Card brand (Visa, Mastercard) */
  cardBrand: varchar("cardBrand", { length: 64 }),
  /** Last 4 digits */
  lastDigits: varchar("lastDigits", { length: 8 }),
  /** Whether this token is active */
  isActive: boolean("isActive").default(true).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CardToken = typeof cardTokens.$inferSelect;
export type InsertCardToken = typeof cardTokens.$inferInsert;

/**
 * Payment transactions - log of all PayPhone payment attempts.
 */
export const paymentTransactions = mysqlTable("payment_transactions", {
  id: int("id").autoincrement().primaryKey(),
  /** Client-generated unique transaction ID */
  clientTransactionId: varchar("clientTransactionId", { length: 64 }).notNull().unique(),
  /** Email of the payer */
  email: varchar("email", { length: 320 }).notNull(),
  /** Amount in cents */
  amount: int("amount").notNull(),
  /** PayPhone transaction ID (set after confirmation) */
  payphoneTransactionId: int("payphoneTransactionId"),
  /** Status: pending, approved, cancelled, error */
  status: mysqlEnum("status", ["pending", "approved", "cancelled", "error"]).default("pending").notNull(),
  /** PayPhone status code */
  statusCode: int("statusCode"),
  /** PayPhone authorization code */
  authorizationCode: varchar("authorizationCode", { length: 64 }),
  /** Card type used */
  cardType: varchar("cardType", { length: 32 }),
  /** Card brand */
  cardBrand: varchar("cardBrand", { length: 128 }),
  /** Last 4 digits of card */
  lastDigits: varchar("lastDigits", { length: 8 }),
  /** Full PayPhone response JSON */
  payphoneResponse: text("payphoneResponse"),
  /** Whether this transaction was a recurring charge (not user-initiated) */
  isRecurringCharge: boolean("isRecurringCharge").default(false).notNull(),
  /** Card token ID used for this recurring charge */
  cardTokenId: int("cardTokenId"),
  /** Card holder name (captured at payment form) */
  cardHolder: varchar("cardHolder", { length: 255 }),
  /** Document ID / cédula (captured at payment form) */
  documentId: varchar("documentId", { length: 20 }),
  /** Phone number (captured at payment form, for follow-up) */
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  /** Plan: monthly or annual */
  plan: varchar("plan", { length: 16 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type PaymentTransaction = typeof paymentTransactions.$inferSelect;
export type InsertPaymentTransaction = typeof paymentTransactions.$inferInsert;

/**
 * Code activations - tracks when users activate access with a promotional code.
 * Used to detect potential code sharing (same code from multiple devices).
 */
export const codeActivations = mysqlTable("code_activations", {
  id: int("id").autoincrement().primaryKey(),
  /** The code that was activated */
  code: varchar("code", { length: 64 }).notNull(),
  /** Device fingerprint (unique per device installation) */
  deviceId: varchar("deviceId", { length: 128 }).notNull(),
  /** Platform: ios, android, web */
  platform: varchar("platform", { length: 16 }),
  /** Optional email if user provided one */
  email: varchar("email", { length: 320 }),
  /** IP address at time of activation */
  ipAddress: varchar("ipAddress", { length: 64 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type CodeActivation = typeof codeActivations.$inferSelect;
export type InsertCodeActivation = typeof codeActivations.$inferInsert;

/**
 * Docente accounts - email + password login for teachers.
 * Separate from OAuth users. Subscription check is still by email.
 */
export const docenteAccounts = mysqlTable("docente_accounts", {
  id: int("id").autoincrement().primaryKey(),
  /** Email (unique identifier) */
  email: varchar("email", { length: 320 }).notNull().unique(),
  /** Full name of the teacher */
  nombre: varchar("nombre", { length: 255 }).notNull(),
  /** scrypt-hashed password (salt:hash format) */
  passwordHash: varchar("passwordHash", { length: 512 }).notNull(),
  /** Timestamp of the most recent successful login (null if never logged in since tracking started) */
  lastLoginAt: timestamp("lastLoginAt"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type DocenteAccount = typeof docenteAccounts.$inferSelect;
export type InsertDocenteAccount = typeof docenteAccounts.$inferInsert;

/**
 * Docente contacts - manually registered by admin when giving out codes.
 * Tracks who received which code, their contact info, and payment status.
 */
export const docenteContacts = mysqlTable("docente_contacts", {
  id: int("id").autoincrement().primaryKey(),
  /** Access code given to this teacher */
  code: varchar("code", { length: 64 }).notNull(),
  /** Teacher's full name */
  nombre: varchar("nombre", { length: 255 }).notNull(),
  /** Teacher's email */
  email: varchar("email", { length: 320 }),
  /** Teacher's phone number */
  phoneNumber: varchar("phoneNumber", { length: 20 }),
  /** City or institution */
  institucion: varchar("institucion", { length: 255 }),
  /** Whether they paid for the code */
  pago: boolean("pago").default(false).notNull(),
  /** Amount charged (0 = free) in cents */
  montoCobrado: int("montoCobrado").default(0).notNull(),
  /** Optional notes */
  notas: text("notas"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type DocenteContact = typeof docenteContacts.$inferSelect;
export type InsertDocenteContact = typeof docenteContacts.$inferInsert;

/**
 * PCA Documents - Planificación Curricular Anual generada con IA.
 * El docente llena el formulario, la IA genera el contenido, el pago lo desbloquea.
 */
export const pcaDocuments = mysqlTable("pca_documents", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente (o deviceId como fallback) */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  /** Estado: draft=en borrador, generated=IA generó, paid=desbloqueado */
  status: mysqlEnum("status", ["draft", "generated", "paid"]).default("draft").notNull(),
  /** JSON del formulario completo (PcaFormData) */
  formData: text("formData").notNull(),
  /** JSON del resultado de la IA (PcaAiResult), nulo hasta generar */
  aiResult: text("aiResult"),
  /** ClientTransactionId de PayPhone (se llena al iniciar pago) */
  clientTransactionId: varchar("clientTransactionId", { length: 64 }),
  /** ID de transacción PayPhone (se llena tras pago exitoso) */
  payphoneTransactionId: int("payphoneTransactionId"),
  /** Código de autorización PayPhone */
  authorizationCode: varchar("authorizationCode", { length: 64 }),
  /** Monto pagado en centavos (siempre 1499 = $14.99) */
  amountPaid: int("amountPaid"),
  /** FK → formato_plantillas.id — si tiene plantilla importada, exporta en ese formato */
  formatoPlantillaId: int("formatoPlantillaId"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type PcaDocumentRow = typeof pcaDocuments.$inferSelect;
export type InsertPcaDocument = typeof pcaDocuments.$inferInsert;

/**
 * Formato Plantilla — recurso reutilizable derivado de un documento importado.
 * Contiene el archivo original (storageKey), la estructura física analizada,
 * y los bindings que mapean campos de planificación a ubicaciones en el documento.
 * Se crea automáticamente durante la importación y se asocia a planificaciones
 * para exportar en el mismo formato original.
 */
export const formatoPlantillas = mysqlTable("formato_plantillas", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente o deviceId como fallback */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  /** Nombre legible del formato (ej. "PCA Institucional 2026") */
  nombre: varchar("nombre", { length: 255 }).notNull(),
  /** Tipo de planificación al que corresponde */
  tipoPlanificacion: varchar("tipoPlanificacion", { length: 32 }).notNull(),
  /** Formato del archivo original: docx | doc | pdf */
  formatoOrigen: varchar("formatoOrigen", { length: 16 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  /** Clave en storage del archivo original (mismo storageKey de importedFormatDocuments) */
  storageKey: varchar("storageKey", { length: 512 }).notNull(),
  /** Buffer del template DOCX original en base64 (para rellenar y exportar) */
  templateBufferBase64: longtext("templateBufferBase64"),
  /** Número de versión del análisis de estructura/bindings */
  version: int("version").notNull().default(1),
  /** JSON: PlantillaEstructura — mapa navegable del documento */
  estructura: text("estructura").notNull(),
  /** JSON: PlantillaBindings — campos y regiones repetibles */
  bindings: text("bindings").notNull(),
  /** JSON: PlantillaConfiguracion — reglas especiales de exportación */
  configuracion: text("configuracion"),
  /** Si está activo para uso en exportaciones */
  activo: boolean("activo").notNull().default(true),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().notNull(),
});

export type FormatoPlantillaRow = typeof formatoPlantillas.$inferSelect;
export type InsertFormatoPlantilla = typeof formatoPlantillas.$inferInsert;

/**
 * Planificacion stats - lightweight counter synced from device each time a
 * planificacion is created or deleted. Identified by email (subscribers) or
 * code (code-based users).
 */
export const planificacionStats = mysqlTable("planificacion_stats", {
  id: int("id").autoincrement().primaryKey(),
  /** Primary identifier: email for subscribers, access code for code users */
  identifier: varchar("identifier", { length: 320 }).notNull().unique(),
  /** 'email' | 'code' */
  identifierType: varchar("identifierType", { length: 16 }).notNull().default("email"),
  /** Total planificaciones currently saved on the device */
  count: int("count").notNull().default(0),
  /** Platform of the last sync: ios | android | web */
  platform: varchar("platform", { length: 16 }),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type PlanificacionStats = typeof planificacionStats.$inferSelect;
export type InsertPlanificacionStats = typeof planificacionStats.$inferInsert;

/**
 * Adaptaciones Curriculares — documentos generados con IA para estudiantes con NEE.
 * Privacy-first: no se requiere nombre real; se usa código anónimo de estudiante.
 */
export const curricularAdaptations = mysqlTable("curricular_adaptations", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente o deviceId como fallback */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  /** Código anónimo del estudiante — sin nombre real */
  codigoEstudiante: varchar("codigoEstudiante", { length: 64 }),
  /** Contexto pedagógico */
  institucion: varchar("institucion", { length: 255 }),
  docente: varchar("docente", { length: 255 }),
  anioLectivo: varchar("anioLectivo", { length: 20 }),
  area: varchar("area", { length: 20 }).notNull(),
  subnivel: int("subnivel"),
  grado: varchar("grado", { length: 64 }).notNull(),
  paralelo: varchar("paralelo", { length: 20 }),
  periodoPedagogico: varchar("periodoPedagogico", { length: 64 }),
  trimestre: varchar("trimestre", { length: 20 }),
  /** Destreza a adaptar */
  codigoDestreza: varchar("codigoDestreza", { length: 64 }),
  descripcionDestreza: text("descripcionDestreza"),
  /** 1 = acceso, 2 = proceso, 3 = resultado */
  gradoAdaptacion: mysqlEnum("gradoAdaptacion", ["1", "2", "3"]).notNull(),
  /** Tipo de NEE — nunca diagnóstico médico */
  tipoNEE: varchar("tipoNEE", { length: 64 }).notNull(),
  estiloAprendizaje: varchar("estiloAprendizaje", { length: 64 }),
  fortalezas: text("fortalezas"),
  desafios: text("desafios"),
  apoyosDisponibles: text("apoyosDisponibles"),
  /** JSON del resultado de la IA (AdaptacionAiResult) */
  aiResult: text("aiResult"),
  /** Número de versión: se incrementa en cada regeneración */
  version: int("version").default(1).notNull(),
  status: mysqlEnum("status", ["draft", "generated"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type CurricularAdaptationRow = typeof curricularAdaptations.$inferSelect;
export type InsertCurricularAdaptation = typeof curricularAdaptations.$inferInsert;

/**
 * Desagregación/gradación de DCD por grado — respaldo best-effort en la nube,
 * igual que curricular_adaptations. La fuente de verdad es la selección en la
 * planificación; la app funciona sin esta tabla si falla. Una fila por
 * (sessionId, codigoDCD, grado): la UNIQUE habilita la reutilización sin regenerar.
 */
export const dcdDesagregaciones = mysqlTable(
  "dcd_desagregaciones",
  {
    id: int("id").autoincrement().primaryKey(),
    /** Email del docente o deviceId como fallback */
    sessionId: varchar("sessionId", { length: 320 }).notNull(),
    /** Código de la DCD oficial del catálogo (nunca se modifica) */
    codigoDCD: varchar("codigoDCD", { length: 64 }).notNull(),
    subnivel: int("subnivel").notNull(),
    /** Grado destino de esta versión graduada (p. ej. 3) */
    grado: int("grado").notNull(),
    /** Último grado del subnivel — recibe la versión completa */
    gradoMaximo: int("gradoMaximo").notNull(),
    /** Snapshot del texto oficial de la DCD */
    descripcionDCD: text("descripcionDCD").notNull(),
    /** Texto oficial del indicador de evaluación asociado */
    indicadorOriginal: text("indicadorOriginal").notNull(),
    /** Texto graduado de la DCD para este grado */
    dcdGraduada: text("dcdGraduada").notNull(),
    /** Texto graduado del indicador para este grado */
    indicadorGraduado: text("indicadorGraduado").notNull(),
    /** Proceso cognitivo esperado para el grado (referencia Marzano) */
    procesoCognitivo: varchar("procesoCognitivo", { length: 128 }),
    /** Estado de la fila */
    estado: mysqlEnum("estado", ["generado", "editado", "aprobado"])
      .default("generado")
      .notNull(),
    /** Número de versión: se incrementa en cada regeneración */
    version: int("version").default(1).notNull(),
    /** JSON crudo de la respuesta de la IA */
    aiResult: text("aiResult"),
    createdAt: timestamp("createdAt").defaultNow().notNull(),
    updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  },
  (t) => [uniqueIndex("uq_dcd_session_grado").on(t.sessionId, t.codigoDCD, t.grado)]
);

export type DcdDesagregacionRow = typeof dcdDesagregaciones.$inferSelect;
export type InsertDcdDesagregacion = typeof dcdDesagregaciones.$inferInsert;

/**
 * Conecta, Nivela y Crea (CNC) — planes generados con IA para las 5 semanas
 * de arranque del año escolar (MinEduc). Respaldo best-effort en la nube,
 * igual que curricularAdaptations; la app funciona sin esta tabla si falla.
 */
export const connectaNivelaCrea = mysqlTable("connecta_nivela_crea", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente o deviceId como fallback */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  institucion: varchar("institucion", { length: 255 }),
  docente: varchar("docente", { length: 255 }),
  anioLectivo: varchar("anioLectivo", { length: 20 }),
  grado: varchar("grado", { length: 64 }),
  paralelo: varchar("paralelo", { length: 20 }),
  subnivel: varchar("subnivel", { length: 64 }),
  /** "general" | "bt" */
  modalidad: mysqlEnum("modalidad", ["general", "bt"]).default("general").notNull(),
  figuraProfesionalId: varchar("figuraProfesionalId", { length: 64 }),
  moduloId: varchar("moduloId", { length: 64 }),
  /** JSON del formulario completo (Semana1/2y3/4y5 + extras BT) */
  form: text("form"),
  /** JSON del resultado de la IA (ConectaNivelaCreaAiResult) */
  aiResult: text("aiResult"),
  status: mysqlEnum("status", ["draft", "generated"]).default("draft").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ConnectaNivelaCreaRow = typeof connectaNivelaCrea.$inferSelect;
export type InsertConnectaNivelaCrea = typeof connectaNivelaCrea.$inferInsert;

/**
 * Evaluaciones Diagnósticas — respaldo best-effort en la nube de las
 * evaluaciones creadas por el docente. La fuente de verdad es AsyncStorage;
 * la app funciona sin esta tabla si falla. Mismo patrón que
 * connectaNivelaCrea: formulario y resultado IA como JSON.
 */
export const evaluacionesDiagnosticas = mysqlTable("evaluaciones_diagnosticas", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente o deviceId como fallback */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  /** Estado de la evaluación local */
  status: mysqlEnum("status", ["borrador", "publicada", "aplicada", "analizada"]).default("borrador").notNull(),
  /** JSON de la EvaluacionDiagnostica completa */
  form: text("form"),
  /** JSON de preguntas sugeridas por IA (si las hubo) */
  aiResult: text("aiResult"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type EvaluacionDiagnosticaRow = typeof evaluacionesDiagnosticas.$inferSelect;
export type InsertEvaluacionDiagnostica = typeof evaluacionesDiagnosticas.$inferInsert;

/**
 * Documentos importados — el docente sube un formato oficial MinEduc
 * (.doc/.docx/.pdf) en blanco o parcialmente llenado; el sistema reconoce el
 * tipo de planificación, extrae sus campos y los completa con IA. Registro
 * best-effort en la nube, mismo patrón que curricularAdaptations: la app
 * funciona sin esta tabla si falla. Ver openspec/changes/importar-formato-planificacion.
 */
export const importedFormatDocuments = mysqlTable("imported_format_documents", {
  id: int("id").autoincrement().primaryKey(),
  /** Email del docente o deviceId como fallback */
  sessionId: varchar("sessionId", { length: 320 }).notNull(),
  /** Nombre y tipo MIME del archivo tal como lo subió el docente */
  fileName: varchar("fileName", { length: 255 }).notNull(),
  mimeType: varchar("mimeType", { length: 128 }).notNull(),
  /** Clave/URL en el storage proxy donde quedó el archivo original */
  storageKey: varchar("storageKey", { length: 512 }),
  /**
   * Tipo de planificación detectado por el matcher de huellas — nulo hasta
   * reconocerse, "no_reconocido" si no coincide con ningún formato soportado.
   */
  tipoDetectado: varchar("tipoDetectado", { length: 32 }),
  /** JSON de los campos/estructura extraídos del documento (antes de IA) */
  camposExtraidos: text("camposExtraidos"),
  /** JSON del resultado combinado (extraído + completado por IA) */
  resultado: text("resultado"),
  /** Si el tipo detectado tiene tabla propia (ej. pca_documents), su id */
  planificacionId: int("planificacionId"),
  status: mysqlEnum("status", ["subido", "analizando", "completado", "error", "ambiguo"])
    .default("subido")
    .notNull(),
  /** Mensaje de error legible para el docente, si status = "error" */
  errorMensaje: text("errorMensaje"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type ImportedFormatDocumentRow = typeof importedFormatDocuments.$inferSelect;
export type InsertImportedFormatDocument = typeof importedFormatDocuments.$inferInsert;

/**
 * Meta CAPI — señales de atribución guardadas antes de redirigir a PayPhone.
 * Se recuperan en activate.ts para enviar el evento Purchase a Meta CAPI.
 */
export const paymentAttribution = mysqlTable("payment_attribution", {
  clientTxId:  varchar("client_tx_id", { length: 64 }).primaryKey(),
  eventId:     varchar("event_id",     { length: 64 }).notNull(),
  valueCents:  int("value_cents").notNull(),
  currency:    varchar("currency",     { length: 8  }).notNull().default("USD"),
  fbp:         varchar("fbp",          { length: 128 }),
  fbc:         varchar("fbc",          { length: 255 }),
  clientIp:    varchar("client_ip",    { length: 64  }),
  userAgent:   varchar("user_agent",   { length: 512 }),
  email:       varchar("email",        { length: 255 }),
  phone:       varchar("phone",        { length: 32  }),
  userId:      varchar("user_id",      { length: 64  }),
  sourceUrl:   varchar("source_url",   { length: 512 }),
  sent:        boolean("sent").notNull().default(false),
  createdAt:   timestamp("created_at").defaultNow(),
});

// ═══════════════════════════════════════════════════════════════════════════
// Bachillerato Técnico — Catálogo Curricular (Acuerdo 00065-A)
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Áreas técnicas del Bachillerato Técnico.
 * Ej: "Deportes y Salud", "Artística", "Técnica", "Tecnologías"
 */
export const btAreasTecnicas = mysqlTable("bt_areas_tecnicas", {
  id: int("id").autoincrement().primaryKey(),
  nombre: varchar("nombre", { length: 128 }).notNull(),
  descripcion: text("descripcion"),
});

export type BtAreaTecnica = typeof btAreasTecnicas.$inferSelect;
export type InsertBtAreaTecnica = typeof btAreasTecnicas.$inferInsert;

/**
 * Familias profesionales dentro de un área técnica.
 * Ej: "Deporte", "Salud y Servicio", "Industrial", "Tecnologías"
 */
export const btFamiliasProfesionales = mysqlTable("bt_familias_profesionales", {
  id: int("id").autoincrement().primaryKey(),
  areaId: int("areaId").notNull(),
  nombre: varchar("nombre", { length: 128 }).notNull(),
  codigo: varchar("codigo", { length: 64 }).notNull().unique(),
  descripcion: text("descripcion"),
});

export type BtFamiliaProfesional = typeof btFamiliasProfesionales.$inferSelect;
export type InsertBtFamiliaProfesional = typeof btFamiliasProfesionales.$inferInsert;

/**
 * Figuras profesionales dentro de una familia.
 * Ej: "Actividad Física, Deporte y Recreación", "Gestión Deportiva y Cultural"
 */
export const btFigurasProfesionales = mysqlTable("bt_figuras_profesionales", {
  id: int("id").autoincrement().primaryKey(),
  familiaId: int("familiaId").notNull(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  codigo: varchar("codigo", { length: 64 }).notNull().unique(),
  perfilProfesional: text("perfilProfesional"),
  activa: boolean("activa").notNull().default(true),
  /** Figura que reemplaza a esta si está deprecada */
  figuraReemplazoId: int("figuraReemplazoId"),
});

export type BtFiguraProfesional = typeof btFigurasProfesionales.$inferSelect;
export type InsertBtFiguraProfesional = typeof btFigurasProfesionales.$inferInsert;

/**
 * Módulos formativos asociados a una figura profesional.
 * Tipo: "generico" (transversal) o "especializacion" (específico de la figura)
 */
export const btModulosFormativos = mysqlTable("bt_modulos_formativos", {
  id: int("id").autoincrement().primaryKey(),
  figuraId: int("figuraId").notNull(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  codigo: varchar("codigo", { length: 64 }),
  tipo: mysqlEnum("tipo", ["generico", "especializacion"]).notNull().default("especializacion"),
});

export type BtModuloFormativo = typeof btModulosFormativos.$inferSelect;
export type InsertBtModuloFormativo = typeof btModulosFormativos.$inferInsert;

/**
 * Contenidos atómicos de un módulo.
 * Cada contenido es un registro individual con tipo, descripción y orden.
 */
export const btContenidos = mysqlTable("bt_contenidos", {
  id: int("id").autoincrement().primaryKey(),
  moduloId: int("moduloId").notNull(),
  tipo: mysqlEnum("tipo", ["conceptual", "procedimental", "actitudinal"]).notNull(),
  descripcion: text("descripcion").notNull(),
  orden: int("orden").notNull().default(0),
});

export type BtContenido = typeof btContenidos.$inferSelect;
export type InsertBtContenido = typeof btContenidos.$inferInsert;

/**
 * Resultados de aprendizaje (RA) de un módulo.
 */
export const btResultadosAprendizaje = mysqlTable("bt_resultados_aprendizaje", {
  id: int("id").autoincrement().primaryKey(),
  moduloId: int("moduloId").notNull(),
  codigo: varchar("codigo", { length: 32 }).notNull(),
  descripcion: text("descripcion").notNull(),
});

export type BtResultadoAprendizaje = typeof btResultadosAprendizaje.$inferSelect;
export type InsertBtResultadoAprendizaje = typeof btResultadosAprendizaje.$inferInsert;

/**
 * Criterios de evaluación (CE) asociados a un RA.
 */
export const btCriteriosEvaluacion = mysqlTable("bt_criterios_evaluacion", {
  id: int("id").autoincrement().primaryKey(),
  raId: int("raId").notNull(),
  codigo: varchar("codigo", { length: 32 }).notNull(),
  descripcion: text("descripcion").notNull(),
});

export type BtCriterioEvaluacion = typeof btCriteriosEvaluacion.$inferSelect;
export type InsertBtCriterioEvaluacion = typeof btCriteriosEvaluacion.$inferInsert;

/**
 * Distribución de módulos por año BGU.
 * Permite que un módulo esté en múltiples años con carga horaria diferente.
 */
export const btModuloPorAnio = mysqlTable("bt_modulo_por_anio", {
  id: int("id").autoincrement().primaryKey(),
  moduloId: int("moduloId").notNull(),
  anioBGU: int("anioBGU").notNull(), // 1, 2, o 3
  cargaHorariaSemanal: int("cargaHorariaSemanal").notNull(),
});

export type BtModuloPorAnio = typeof btModuloPorAnio.$inferSelect;
export type InsertBtModuloPorAnio = typeof btModuloPorAnio.$inferInsert;

/**
 * Planificación BT: une una figura profesional con un año BGU y año lectivo.
 */
export const btPlanificaciones = mysqlTable("bt_planificaciones", {
  id: int("id").autoincrement().primaryKey(),
  sessionId: varchar("sessionId", { length: 128 }).notNull(),
  figuraId: int("figuraId").notNull(),
  anioBGU: int("anioBGU").notNull(),
  anioLectivo: varchar("anioLectivo", { length: 16 }).notNull(),
  nombre: varchar("nombre", { length: 200 }).notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
});

export type BtPlanificacion = typeof btPlanificaciones.$inferSelect;
export type InsertBtPlanificacion = typeof btPlanificaciones.$inferInsert;

/**
 * Distribución de contenidos/RA por trimestre dentro de una planificación.
 */
export const btDistribucionTrimestre = mysqlTable("bt_distribucion_trimestre", {
  id: int("id").autoincrement().primaryKey(),
  planificacionId: int("planificacionId").notNull(),
  trimestre: int("trimestre").notNull(), // 1, 2, o 3
  contenidoId: int("contenidoId"),
  raId: int("raId"),
});

export type BtDistribucionTrimestre = typeof btDistribucionTrimestre.$inferSelect;
export type InsertBtDistribucionTrimestre = typeof btDistribucionTrimestre.$inferInsert;
