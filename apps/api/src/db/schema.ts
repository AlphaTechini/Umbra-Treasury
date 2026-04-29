import {
  boolean,
  index,
  jsonb,
  type AnyPgColumn,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";

export const baseTokenEnum = pgEnum("base_token", ["usdc", "usdt", "wsol", "umbra", "other"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["income", "expense", "transfer"]);
export const transactionCategoryEnum = pgEnum("transaction_category", [
  "grant",
  "payroll",
  "vendor",
  "ops",
  "tax",
  "treasury_transfer",
  "other",
]);
export const umbraOperationTypeEnum = pgEnum("umbra_operation_type", [
  "registration",
  "deposit",
  "withdraw",
  "utxo_create",
  "utxo_claim",
  "compliance_grant",
  "compliance_revoke",
  "mock",
]);
export const umbraStatusEnum = pgEnum("umbra_status", ["not_started", "pending", "confirmed", "failed"]);
export const privacyStatusEnum = pgEnum("privacy_status", [
  "private",
  "summary_included",
  "disclosure_available",
]);
export const disclosureReasonEnum = pgEnum("disclosure_reason", [
  "audit",
  "tax",
  "grant_review",
  "community_review",
  "internal_review",
  "other",
]);
export const disclosureScopeEnum = pgEnum("disclosure_scope", [
  "single_transaction",
  "category",
  "date_range",
  "full_report",
]);
export const disclosureMethodEnum = pgEnum("disclosure_method", ["viewing_key", "x25519_grant", "mock"]);
export const disclosureStatusEnum = pgEnum("disclosure_status", ["pending", "approved", "rejected", "fulfilled"]);
export const reportTypeEnum = pgEnum("report_type", ["public_summary", "auditor_report", "tax_estimate"]);
export const reportSourceEnum = pgEnum("report_source", ["summary_only", "umbra_compliance", "mock"]);
export const verificationStatusEnum = pgEnum("verification_status", ["unverified", "verified", "failed"]);
export const accessLogActionEnum = pgEnum("access_log_action", [
  "dao_created",
  "transaction_added",
  "disclosure_requested",
  "disclosure_approved",
  "disclosure_rejected",
  "compliance_grant_issued",
  "compliance_grant_revoked",
  "report_generated",
  "mock_disclosure_generated",
]);
export const accessLogTargetTypeEnum = pgEnum("access_log_target_type", [
  "dao",
  "transaction",
  "disclosure_request",
  "report",
  "umbra_operation",
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
};

export const users = pgTable(
  "users",
  {
    id: text("id").primaryKey(),
    walletAddress: text("wallet_address").notNull(),
    username: text("username"),
    ...timestamps,
  },
  (table) => [uniqueIndex("users_wallet_address_unique").on(table.walletAddress)],
);

export const daos = pgTable(
  "daos",
  {
    id: text("id").primaryKey(),
    ownerId: text("owner_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    treasuryAddress: text("treasury_address"),
    baseToken: baseTokenEnum("base_token").notNull(),
    description: text("description"),
    isPublic: boolean("is_public").default(true).notNull(),
    ...timestamps,
  },
  (table) => [uniqueIndex("daos_slug_unique").on(table.slug), index("daos_owner_id_idx").on(table.ownerId)],
);

export const treasuryTransactions = pgTable(
  "treasury_transactions",
  {
    id: text("id").primaryKey(),
    daoId: text("dao_id")
      .notNull()
      .references(() => daos.id, { onDelete: "cascade" }),
    type: transactionTypeEnum("type").notNull(),
    category: transactionCategoryEnum("category").notNull(),
    token: text("token").notNull(),
    amountHint: text("amount_hint"),
    date: timestamp("date", { withTimezone: true }).notNull(),
    publicCounterpartyLabel: text("public_counterparty_label"),
    publicMemo: text("public_memo"),
    encryptedPrivateMetadata: text("encrypted_private_metadata"),
    umbraOperationType: umbraOperationTypeEnum("umbra_operation_type").notNull(),
    umbraOperationRefs: jsonb("umbra_operation_refs").$type<Record<string, unknown>>().notNull(),
    umbraStatus: umbraStatusEnum("umbra_status").default("not_started").notNull(),
    privacyStatus: privacyStatusEnum("privacy_status").default("private").notNull(),
    createdById: text("created_by_id")
      .notNull()
      .references(() => users.id, { onDelete: "restrict" }),
    ...timestamps,
  },
  (table) => [
    index("treasury_transactions_dao_id_idx").on(table.daoId),
    index("treasury_transactions_created_by_id_idx").on(table.createdById),
    index("treasury_transactions_dao_date_idx").on(table.daoId, table.date),
    index("treasury_transactions_dao_category_idx").on(table.daoId, table.category),
  ],
);

export const disclosureRequests = pgTable(
  "disclosure_requests",
  {
    id: text("id").primaryKey(),
    daoId: text("dao_id")
      .notNull()
      .references(() => daos.id, { onDelete: "cascade" }),
    requesterName: text("requester_name").notNull(),
    requesterOrganization: text("requester_organization"),
    requesterContact: text("requester_contact"),
    reason: disclosureReasonEnum("reason").notNull(),
    message: text("message"),
    requestedScope: disclosureScopeEnum("requested_scope").notNull(),
    transactionId: text("transaction_id").references(() => treasuryTransactions.id, { onDelete: "set null" }),
    category: text("category"),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    disclosureMethod: disclosureMethodEnum("disclosure_method"),
    status: disclosureStatusEnum("status").default("pending").notNull(),
    fulfilledReportId: text("fulfilled_report_id").references((): AnyPgColumn => reports.id, { onDelete: "set null" }),
    reviewedById: text("reviewed_by_id").references(() => users.id, { onDelete: "set null" }),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    uniqueIndex("disclosure_requests_fulfilled_report_id_unique").on(table.fulfilledReportId),
    index("disclosure_requests_dao_id_idx").on(table.daoId),
    index("disclosure_requests_transaction_id_idx").on(table.transactionId),
    index("disclosure_requests_reviewed_by_id_idx").on(table.reviewedById),
    index("disclosure_requests_status_idx").on(table.status),
  ],
);

export const reports = pgTable(
  "reports",
  {
    id: text("id").primaryKey(),
    daoId: text("dao_id")
      .notNull()
      .references(() => daos.id, { onDelete: "cascade" }),
    disclosureRequestId: text("disclosure_request_id").references(() => disclosureRequests.id, {
      onDelete: "set null",
    }),
    type: reportTypeEnum("type").notNull(),
    source: reportSourceEnum("source").notNull(),
    verificationStatus: verificationStatusEnum("verification_status").default("unverified").notNull(),
    title: text("title").notNull(),
    startDate: timestamp("start_date", { withTimezone: true }),
    endDate: timestamp("end_date", { withTimezone: true }),
    generatedById: text("generated_by_id").references(() => users.id, { onDelete: "set null" }),
    generatedAt: timestamp("generated_at", { withTimezone: true }).defaultNow().notNull(),
    reportData: jsonb("report_data").$type<Record<string, unknown>>().notNull(),
  },
  (table) => [
    index("reports_dao_id_idx").on(table.daoId),
    index("reports_disclosure_request_id_idx").on(table.disclosureRequestId),
    index("reports_generated_by_id_idx").on(table.generatedById),
    index("reports_type_idx").on(table.type),
    index("reports_source_idx").on(table.source),
  ],
);

export const accessLogs = pgTable(
  "access_logs",
  {
    id: text("id").primaryKey(),
    daoId: text("dao_id")
      .notNull()
      .references(() => daos.id, { onDelete: "cascade" }),
    actorId: text("actor_id").references(() => users.id, { onDelete: "set null" }),
    actorLabel: text("actor_label"),
    action: accessLogActionEnum("action").notNull(),
    targetType: accessLogTargetTypeEnum("target_type").notNull(),
    targetId: text("target_id").notNull(),
    metadata: jsonb("metadata").$type<Record<string, unknown>>(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("access_logs_dao_id_idx").on(table.daoId),
    index("access_logs_actor_id_idx").on(table.actorId),
    index("access_logs_target_idx").on(table.targetType, table.targetId),
    index("access_logs_action_idx").on(table.action),
  ],
);
