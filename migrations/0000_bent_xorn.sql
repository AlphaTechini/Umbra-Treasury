CREATE TYPE "public"."access_log_action" AS ENUM('dao_created', 'transaction_added', 'disclosure_requested', 'disclosure_approved', 'disclosure_rejected', 'compliance_grant_issued', 'compliance_grant_revoked', 'report_generated', 'mock_disclosure_generated');--> statement-breakpoint
CREATE TYPE "public"."access_log_target_type" AS ENUM('dao', 'transaction', 'disclosure_request', 'report', 'umbra_operation');--> statement-breakpoint
CREATE TYPE "public"."base_token" AS ENUM('usdc', 'usdt', 'wsol', 'umbra', 'other');--> statement-breakpoint
CREATE TYPE "public"."disclosure_method" AS ENUM('viewing_key', 'x25519_grant', 'mock');--> statement-breakpoint
CREATE TYPE "public"."disclosure_reason" AS ENUM('audit', 'tax', 'grant_review', 'community_review', 'internal_review', 'other');--> statement-breakpoint
CREATE TYPE "public"."disclosure_scope" AS ENUM('single_transaction', 'category', 'date_range', 'full_report');--> statement-breakpoint
CREATE TYPE "public"."disclosure_status" AS ENUM('pending', 'approved', 'rejected', 'fulfilled');--> statement-breakpoint
CREATE TYPE "public"."privacy_status" AS ENUM('private', 'summary_included', 'disclosure_available');--> statement-breakpoint
CREATE TYPE "public"."report_source" AS ENUM('summary_only', 'umbra_compliance', 'mock');--> statement-breakpoint
CREATE TYPE "public"."report_type" AS ENUM('public_summary', 'auditor_report', 'tax_estimate');--> statement-breakpoint
CREATE TYPE "public"."transaction_category" AS ENUM('grant', 'payroll', 'vendor', 'ops', 'tax', 'treasury_transfer', 'other');--> statement-breakpoint
CREATE TYPE "public"."transaction_type" AS ENUM('income', 'expense', 'transfer');--> statement-breakpoint
CREATE TYPE "public"."umbra_operation_type" AS ENUM('registration', 'deposit', 'withdraw', 'utxo_create', 'utxo_claim', 'compliance_grant', 'compliance_revoke', 'mock');--> statement-breakpoint
CREATE TYPE "public"."umbra_status" AS ENUM('not_started', 'pending', 'confirmed', 'failed');--> statement-breakpoint
CREATE TYPE "public"."verification_status" AS ENUM('unverified', 'verified', 'failed');--> statement-breakpoint
CREATE TABLE "access_logs" (
	"id" text PRIMARY KEY NOT NULL,
	"dao_id" text NOT NULL,
	"actor_id" text,
	"actor_label" text,
	"action" "access_log_action" NOT NULL,
	"target_type" "access_log_target_type" NOT NULL,
	"target_id" text NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "daos" (
	"id" text PRIMARY KEY NOT NULL,
	"owner_id" text NOT NULL,
	"name" text NOT NULL,
	"slug" text NOT NULL,
	"treasury_address" text,
	"base_token" "base_token" NOT NULL,
	"description" text,
	"is_public" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "disclosure_requests" (
	"id" text PRIMARY KEY NOT NULL,
	"dao_id" text NOT NULL,
	"requester_name" text NOT NULL,
	"requester_organization" text,
	"requester_contact" text,
	"reason" "disclosure_reason" NOT NULL,
	"message" text,
	"requested_scope" "disclosure_scope" NOT NULL,
	"transaction_id" text,
	"category" text,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"disclosure_method" "disclosure_method",
	"status" "disclosure_status" DEFAULT 'pending' NOT NULL,
	"fulfilled_report_id" text,
	"reviewed_by_id" text,
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" text PRIMARY KEY NOT NULL,
	"dao_id" text NOT NULL,
	"disclosure_request_id" text,
	"type" "report_type" NOT NULL,
	"source" "report_source" NOT NULL,
	"verification_status" "verification_status" DEFAULT 'unverified' NOT NULL,
	"title" text NOT NULL,
	"start_date" timestamp with time zone,
	"end_date" timestamp with time zone,
	"generated_by_id" text,
	"generated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"report_data" jsonb NOT NULL
);
--> statement-breakpoint
CREATE TABLE "treasury_transactions" (
	"id" text PRIMARY KEY NOT NULL,
	"dao_id" text NOT NULL,
	"type" "transaction_type" NOT NULL,
	"category" "transaction_category" NOT NULL,
	"token" text NOT NULL,
	"amount_hint" text,
	"date" timestamp with time zone NOT NULL,
	"public_counterparty_label" text,
	"public_memo" text,
	"encrypted_private_metadata" text,
	"umbra_operation_type" "umbra_operation_type" NOT NULL,
	"umbra_operation_refs" jsonb NOT NULL,
	"umbra_status" "umbra_status" DEFAULT 'not_started' NOT NULL,
	"privacy_status" "privacy_status" DEFAULT 'private' NOT NULL,
	"created_by_id" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" text PRIMARY KEY NOT NULL,
	"wallet_address" text NOT NULL,
	"username" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_dao_id_daos_id_fk" FOREIGN KEY ("dao_id") REFERENCES "public"."daos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "access_logs" ADD CONSTRAINT "access_logs_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "daos" ADD CONSTRAINT "daos_owner_id_users_id_fk" FOREIGN KEY ("owner_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disclosure_requests" ADD CONSTRAINT "disclosure_requests_dao_id_daos_id_fk" FOREIGN KEY ("dao_id") REFERENCES "public"."daos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disclosure_requests" ADD CONSTRAINT "disclosure_requests_transaction_id_treasury_transactions_id_fk" FOREIGN KEY ("transaction_id") REFERENCES "public"."treasury_transactions"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disclosure_requests" ADD CONSTRAINT "disclosure_requests_fulfilled_report_id_reports_id_fk" FOREIGN KEY ("fulfilled_report_id") REFERENCES "public"."reports"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "disclosure_requests" ADD CONSTRAINT "disclosure_requests_reviewed_by_id_users_id_fk" FOREIGN KEY ("reviewed_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_dao_id_daos_id_fk" FOREIGN KEY ("dao_id") REFERENCES "public"."daos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_disclosure_request_id_disclosure_requests_id_fk" FOREIGN KEY ("disclosure_request_id") REFERENCES "public"."disclosure_requests"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_generated_by_id_users_id_fk" FOREIGN KEY ("generated_by_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasury_transactions" ADD CONSTRAINT "treasury_transactions_dao_id_daos_id_fk" FOREIGN KEY ("dao_id") REFERENCES "public"."daos"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "treasury_transactions" ADD CONSTRAINT "treasury_transactions_created_by_id_users_id_fk" FOREIGN KEY ("created_by_id") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "access_logs_dao_id_idx" ON "access_logs" USING btree ("dao_id");--> statement-breakpoint
CREATE INDEX "access_logs_actor_id_idx" ON "access_logs" USING btree ("actor_id");--> statement-breakpoint
CREATE INDEX "access_logs_target_idx" ON "access_logs" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "access_logs_action_idx" ON "access_logs" USING btree ("action");--> statement-breakpoint
CREATE UNIQUE INDEX "daos_slug_unique" ON "daos" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "daos_owner_id_idx" ON "daos" USING btree ("owner_id");--> statement-breakpoint
CREATE UNIQUE INDEX "disclosure_requests_fulfilled_report_id_unique" ON "disclosure_requests" USING btree ("fulfilled_report_id");--> statement-breakpoint
CREATE INDEX "disclosure_requests_dao_id_idx" ON "disclosure_requests" USING btree ("dao_id");--> statement-breakpoint
CREATE INDEX "disclosure_requests_transaction_id_idx" ON "disclosure_requests" USING btree ("transaction_id");--> statement-breakpoint
CREATE INDEX "disclosure_requests_reviewed_by_id_idx" ON "disclosure_requests" USING btree ("reviewed_by_id");--> statement-breakpoint
CREATE INDEX "disclosure_requests_status_idx" ON "disclosure_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "reports_dao_id_idx" ON "reports" USING btree ("dao_id");--> statement-breakpoint
CREATE INDEX "reports_disclosure_request_id_idx" ON "reports" USING btree ("disclosure_request_id");--> statement-breakpoint
CREATE INDEX "reports_generated_by_id_idx" ON "reports" USING btree ("generated_by_id");--> statement-breakpoint
CREATE INDEX "reports_type_idx" ON "reports" USING btree ("type");--> statement-breakpoint
CREATE INDEX "reports_source_idx" ON "reports" USING btree ("source");--> statement-breakpoint
CREATE INDEX "treasury_transactions_dao_id_idx" ON "treasury_transactions" USING btree ("dao_id");--> statement-breakpoint
CREATE INDEX "treasury_transactions_created_by_id_idx" ON "treasury_transactions" USING btree ("created_by_id");--> statement-breakpoint
CREATE INDEX "treasury_transactions_dao_date_idx" ON "treasury_transactions" USING btree ("dao_id","date");--> statement-breakpoint
CREATE INDEX "treasury_transactions_dao_category_idx" ON "treasury_transactions" USING btree ("dao_id","category");--> statement-breakpoint
CREATE UNIQUE INDEX "users_wallet_address_unique" ON "users" USING btree ("wallet_address");