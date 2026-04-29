import { createSignerFromWalletAccount } from '@umbra-privacy/sdk/solana';
import type { IUmbraSigner } from '@umbra-privacy/sdk/interfaces';

export type UmbraWallet = Parameters<typeof createSignerFromWalletAccount>[0];
export type UmbraWalletAccount = Parameters<typeof createSignerFromWalletAccount>[1];

export function createUmbraSignerFromWalletAccount(wallet: UmbraWallet, walletAccount: UmbraWalletAccount): IUmbraSigner {
	return createSignerFromWalletAccount(wallet, walletAccount);
}
