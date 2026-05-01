import { get } from 'svelte/store';
import type { WalletAuthorization } from '$lib/api/types';
import { connectCompatibleWallet } from '$lib/umbra';
import { walletSession } from './walletSession';

const appName = 'umbra-treasury-disclosure';
const authorizationWindowMs = 10 * 60_000;

export type WalletAuthorizationAction =
	| 'treasury_transaction:create'
	| 'disclosure:review'
	| 'report:mock:create'
	| 'report:umbra:create';

export type SignWalletAuthorizationInput = {
	action: WalletAuthorizationAction;
	daoId?: string | undefined;
	requestId?: string | undefined;
	walletAddress?: string | undefined;
};

export async function signWalletAuthorization(input: SignWalletAuthorizationInput): Promise<WalletAuthorization> {
	const session = get(walletSession);
	const walletAddress = input.walletAddress ?? session.walletAddress;

	if (!walletAddress) {
		throw new Error('Connect a wallet before signing this action.');
	}

	if (session.walletAddress && session.walletAddress !== walletAddress) {
		throw new Error('Connected wallet does not match the requested authorization address.');
	}

	if (!session.walletName) {
		throw new Error('Reconnect your wallet before signing this action.');
	}

	const connectedWallet = await connectCompatibleWallet(session.walletName, walletAddress);
	const issuedAt = new Date();
	const expiresAt = new Date(issuedAt.getTime() + authorizationWindowMs);
	const message = JSON.stringify({
		app: appName,
		action: input.action,
		walletAddress,
		...(input.daoId ? { daoId: input.daoId } : {}),
		...(input.requestId ? { requestId: input.requestId } : {}),
		issuedAt: issuedAt.toISOString(),
		expiresAt: expiresAt.toISOString()
	});
	const signedMessage = await connectedWallet.signer.signMessage(new TextEncoder().encode(message));

	if (signedMessage.signer !== walletAddress) {
		throw new Error('Wallet signed with a different account than the active session.');
	}

	return {
		walletAddress,
		message,
		signature: bytesToBase64(signedMessage.signature)
	};
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = '';

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}
