import { apiGet, apiPatch, apiPost } from './http';
import type { DisclosureMethod, DisclosureReason, DisclosureRequest, DisclosureScope, WalletAuthorization } from './types';

export type CreateDisclosureRequestInput = {
	requesterName: string;
	requesterOrganization?: string | undefined;
	requesterContact?: string | undefined;
	reason: DisclosureReason;
	message?: string | undefined;
	requestedScope: DisclosureScope;
	transactionId?: string | undefined;
	category?: string | undefined;
	startDate?: string | undefined;
	endDate?: string | undefined;
};

export type ReviewDisclosureRequestInput = {
	reviewerWalletAddress: string;
	walletAuthorization: WalletAuthorization;
	reviewerUsername?: string | undefined;
	status: 'approved' | 'rejected';
	disclosureMethod?: DisclosureMethod | undefined;
};

export function createDisclosureRequest(daoId: string, input: CreateDisclosureRequestInput, fetcher?: typeof fetch) {
	return apiPost<{ disclosureRequest: DisclosureRequest }>(
		`/daos/${encodeURIComponent(daoId)}/disclosure-requests`,
		input,
		{ fetcher }
	);
}

export function getDaoDisclosureRequests(daoId: string, fetcher?: typeof fetch) {
	return apiGet<{ disclosureRequests: DisclosureRequest[] }>(
		`/daos/${encodeURIComponent(daoId)}/disclosure-requests`,
		{ fetcher }
	);
}

export function reviewDisclosureRequest(
	daoId: string,
	requestId: string,
	input: ReviewDisclosureRequestInput,
	fetcher?: typeof fetch
) {
	return apiPatch<{ disclosureRequest: DisclosureRequest }>(
		`/daos/${encodeURIComponent(daoId)}/disclosure-requests/${encodeURIComponent(requestId)}/review`,
		input,
		{ fetcher }
	);
}
