import { apiGet, apiPost } from './http';
import type { ApiRecord, Report, WalletAuthorization } from './types';

export type GenerateMockReportInput = {
	generatedByWalletAddress: string;
	walletAuthorization: WalletAuthorization;
	generatedByUsername?: string | undefined;
};

export type GenerateUmbraReportInput = {
	generatedByWalletAddress: string;
	walletAuthorization: WalletAuthorization;
	generatedByUsername?: string | undefined;
	grantTransactionSignature?: string | undefined;
	grantAccountAddress?: string | undefined;
	nonce?: string | undefined;
	operationRefs?: ApiRecord | undefined;
	notes?: string[] | undefined;
};

export function generateMockDisclosureReport(requestId: string, input: GenerateMockReportInput, fetcher?: typeof fetch) {
	return apiPost<{ report: Report }>(`/disclosure-requests/${encodeURIComponent(requestId)}/mock-report`, input, {
		fetcher
	});
}

export function generateUmbraComplianceReport(requestId: string, input: GenerateUmbraReportInput, fetcher?: typeof fetch) {
	return apiPost<{ report: Report }>(`/disclosure-requests/${encodeURIComponent(requestId)}/umbra-report`, input, {
		fetcher
	});
}

export function getDaoReports(daoId: string, fetcher?: typeof fetch) {
	return apiGet<{ reports: Report[] }>(`/daos/${encodeURIComponent(daoId)}/reports`, { fetcher });
}

export function getReport(reportId: string, fetcher?: typeof fetch) {
	return apiGet<{ report: Report }>(`/reports/${encodeURIComponent(reportId)}`, { fetcher });
}
