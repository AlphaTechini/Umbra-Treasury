import { apiGet, apiPost } from './http';
import type { User } from './types';

export type CreateUserInput = {
	walletAddress: string;
	username?: string | undefined;
};

export function createUser(input: CreateUserInput, fetcher?: typeof fetch) {
	return apiPost<{ user: User }>('/users', input, { fetcher });
}

export function getUserByWalletAddress(walletAddress: string, fetcher?: typeof fetch) {
	return apiGet<{ user: User }>(`/users/wallet/${encodeURIComponent(walletAddress)}`, { fetcher });
}
