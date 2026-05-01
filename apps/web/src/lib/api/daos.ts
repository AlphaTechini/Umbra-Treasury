import { apiGet, apiPost } from './http';
import type { BaseToken, Dao, PublicSummary, Report } from './types';

export type CreateDaoInput = {
	ownerWalletAddress: string;
	ownerUsername?: string | undefined;
	name: string;
	slug: string;
	treasuryAddress?: string | undefined;
	baseToken: BaseToken;
	description?: string | undefined;
	isPublic?: boolean | undefined;
};

export type CreatePublicSummaryReportInput = {
	generatedByWalletAddress?: string | undefined;
};

export function createDao(input: CreateDaoInput, fetcher?: typeof fetch) {
	return apiPost<{ dao: Dao }>('/daos', input, { fetcher });
}

export function getDaoBySlug(slug: string, fetcher?: typeof fetch) {
	return apiGet<{ dao: Dao }>(`/daos/slug/${encodeURIComponent(slug)}`, { fetcher });
}

export function getOwnerDaoByWalletAddress(walletAddress: string, fetcher?: typeof fetch) {
	return apiGet<{ dao: Dao }>(`/daos/owner/${encodeURIComponent(walletAddress)}`, { fetcher });
}

export function getDaoSummary(daoId: string, fetcher?: typeof fetch) {
	return apiGet<{ summary: PublicSummary }>(`/daos/${encodeURIComponent(daoId)}/summary`, { fetcher });
}

export function createPublicSummaryReport(daoId: string, input: CreatePublicSummaryReportInput = {}, fetcher?: typeof fetch) {
	return apiPost<{ report: Report }>(`/daos/${encodeURIComponent(daoId)}/summary-report`, input, { fetcher });
}
