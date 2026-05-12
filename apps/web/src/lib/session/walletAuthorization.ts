import { get } from 'svelte/store';
import type { WalletAuthorization } from '$lib/api/types';
import { connectCompatibleWallet } from '$lib/umbra';
import { createSignerFromDirectWallet } from '$lib/umbra/directWalletSigner';
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

	// Try Wallet Standard first, fallback to direct wallet
	let signer;
	try {
		const connectedWallet = await connectCompatibleWallet(session.walletName, walletAddress);
		signer = connectedWallet.signer;
	} catch {
		// Fallback to direct wallet
		signer = createSignerFromDirectWallet(session.walletName, walletAddress);
	}

	const issuedAt = new Date();
	const expiresAt = new Date(issuedAt.getTime() + authorizationWindowMs);
	
	const messageLines = [
		'Umbra Treasury Disclosure',
		'',
		`Action: ${formatActionLabel(input.action)}`,
		`Wallet: ${walletAddress}`,
	];

	if (input.daoId) {
		messageLines.push(`DAO: ${input.daoId}`);
	}

	if (input.requestId) {
		messageLines.push(`Request: ${input.requestId}`);
	}

	messageLines.push('', `Issued: ${issuedAt.toISOString()}`, `Expires: ${expiresAt.toISOString()}`);

	const message = messageLines.join('\n');
	const signedMessage = await signer.signMessage(new TextEncoder().encode(message));

	if (signedMessage.signer !== walletAddress) {
		throw new Error('Wallet signed with a different account than the active session.');
	}

	return {
		walletAddress,
		message,
		signature: bytesToBase64(signedMessage.signature)
	};
}

function formatActionLabel(action: WalletAuthorizationAction): string {
	const labels: Record<WalletAuthorizationAction, string> = {
		'treasury_transaction:create': 'Create Treasury Transaction',
		'disclosure:review': 'Review Disclosure Request',
		'report:mock:create': 'Generate Mock Report',
		'report:umbra:create': 'Generate Umbra Compliance Report'
	};
	return labels[action] || action;
}

function bytesToBase64(bytes: Uint8Array) {
	let binary = '';

	for (const byte of bytes) {
		binary += String.fromCharCode(byte);
	}

	return btoa(binary);
}
