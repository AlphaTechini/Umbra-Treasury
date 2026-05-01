import { apiGet, apiPost } from './http';
import type {
	ApiRecord,
	TransactionCategory,
	TransactionType,
	TreasuryTransaction,
	UmbraOperationType,
	WalletAuthorization
} from './types';

export type CreateTransactionInput = {
	createdByWalletAddress: string;
	walletAuthorization: WalletAuthorization;
	type: TransactionType;
	category: TransactionCategory;
	token: string;
	amountHint?: string | undefined;
	date: string;
	publicCounterpartyLabel?: string | undefined;
	publicMemo?: string | undefined;
	encryptedPrivateMetadata?: string | undefined;
	umbraOperationType: UmbraOperationType;
	umbraOperationRefs?: ApiRecord | undefined;
};

export function createTransaction(daoId: string, input: CreateTransactionInput, fetcher?: typeof fetch) {
	return apiPost<{ transaction: TreasuryTransaction }>(`/daos/${encodeURIComponent(daoId)}/transactions`, input, {
		fetcher
	});
}

export function getDaoTransactions(daoId: string, fetcher?: typeof fetch) {
	return apiGet<{ transactions: TreasuryTransaction[] }>(`/daos/${encodeURIComponent(daoId)}/transactions`, {
		fetcher
	});
}
