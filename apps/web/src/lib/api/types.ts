export type ApiRecord = Record<string, unknown>;

export type BaseToken = 'usdc' | 'usdt' | 'wsol' | 'umbra' | 'other';
export type TransactionType = 'income' | 'expense' | 'transfer';
export type TransactionCategory = 'grant' | 'payroll' | 'vendor' | 'ops' | 'tax' | 'treasury_transfer' | 'other';
export type UmbraOperationType =
	| 'registration'
	| 'deposit'
	| 'withdraw'
	| 'utxo_create'
	| 'utxo_claim'
	| 'compliance_grant'
	| 'compliance_revoke'
	| 'mock';
export type UmbraStatus = 'not_started' | 'pending' | 'confirmed' | 'failed';
export type PrivacyStatus = 'private' | 'summary_included' | 'disclosure_available';
export type DisclosureReason = 'audit' | 'tax' | 'grant_review' | 'community_review' | 'internal_review' | 'other';
export type DisclosureScope = 'single_transaction' | 'category' | 'date_range' | 'full_report';
export type DisclosureMethod = 'viewing_key' | 'x25519_grant' | 'mock';
export type DisclosureStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled';
export type ReportType = 'public_summary' | 'auditor_report' | 'tax_estimate';
export type ReportSource = 'summary_only' | 'umbra_compliance' | 'mock';
export type VerificationStatus = 'unverified' | 'verified' | 'failed';
export type AccessLogAction =
	| 'dao_created'
	| 'transaction_added'
	| 'disclosure_requested'
	| 'disclosure_approved'
	| 'disclosure_rejected'
	| 'compliance_grant_issued'
	| 'compliance_grant_revoked'
	| 'report_generated'
	| 'mock_disclosure_generated';
export type AccessLogTargetType = 'dao' | 'transaction' | 'disclosure_request' | 'report' | 'umbra_operation';

export type User = {
	id: string;
	walletAddress: string;
	username: string | null;
	createdAt: string;
	updatedAt: string;
};

export type Dao = {
	id: string;
	ownerId: string;
	name: string;
	slug: string;
	treasuryAddress: string | null;
	baseToken: BaseToken;
	description: string | null;
	isPublic: boolean;
	createdAt: string;
	updatedAt: string;
	owner?: User;
};

export type TreasuryTransaction = {
	id: string;
	daoId: string;
	type: TransactionType;
	category: TransactionCategory;
	token: string;
	amountHint: string | null;
	date: string;
	publicCounterpartyLabel: string | null;
	publicMemo: string | null;
	encryptedPrivateMetadata: string | null;
	umbraOperationType: UmbraOperationType;
	umbraOperationRefs: ApiRecord;
	umbraStatus: UmbraStatus;
	privacyStatus: PrivacyStatus;
	createdById: string;
	createdAt: string;
	updatedAt: string;
};

export type DisclosureRequest = {
	id: string;
	daoId: string;
	requesterName: string;
	requesterOrganization: string | null;
	requesterContact: string | null;
	reason: DisclosureReason;
	message: string | null;
	requestedScope: DisclosureScope;
	transactionId: string | null;
	category: string | null;
	startDate: string | null;
	endDate: string | null;
	disclosureMethod: DisclosureMethod | null;
	status: DisclosureStatus;
	fulfilledReportId: string | null;
	reviewedById: string | null;
	reviewedAt: string | null;
	createdAt: string;
	updatedAt: string;
	dao?: Dao;
};

export type Report = {
	id: string;
	daoId: string;
	disclosureRequestId: string | null;
	type: ReportType;
	source: ReportSource;
	verificationStatus: VerificationStatus;
	title: string;
	startDate: string | null;
	endDate: string | null;
	generatedById: string | null;
	generatedAt: string;
	reportData: ApiRecord;
	dao?: Dao;
	disclosureRequest?: DisclosureRequest | null;
};

export type AccessLog = {
	id: string;
	daoId: string;
	actorId: string | null;
	actorLabel: string | null;
	action: AccessLogAction;
	targetType: AccessLogTargetType;
	targetId: string;
	metadata: ApiRecord | null;
	createdAt: string;
	actor?: User | null;
};

export type PublicSummary = {
	dao: Pick<Dao, 'id' | 'name' | 'slug' | 'baseToken' | 'isPublic'>;
	totals: {
		income: number;
		expenses: number;
		transfers: number;
		net: number;
		transactionCount: number;
	};
	categoryBreakdown: Record<
		string,
		{
			income: number;
			expenses: number;
			transfers: number;
			transactionCount: number;
		}
	>;
	privacy: {
		source: ReportSource;
		verificationStatus: VerificationStatus;
		note: string;
	};
};

export type WalletAuthorization = {
	walletAddress: string;
	message: string;
	signature: string;
};
