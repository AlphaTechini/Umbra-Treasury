import { get } from 'svelte/store';
import {
	connectCompatibleWallet,
	createUmbraClientSession,
	getActiveUmbraClientSession,
	registerUmbraUser,
	setActiveUmbraClientSession,
	type ActiveUmbraClientSession
} from '$lib/umbra';
import { createSignerFromDirectWallet } from '$lib/umbra/directWalletSigner';
import { walletSession } from './walletSession';

export async function requireActiveUmbraSession(): Promise<ActiveUmbraClientSession> {
	const activeSession = getActiveUmbraClientSession();

	if (activeSession) {
		return activeSession;
	}

	const session = get(walletSession);

	if (!session.walletAddress || !session.walletName) {
		throw new Error('Connect a wallet before using real Umbra operations.');
	}

	// Try Wallet Standard first
	try {
		const connectedWallet = await connectCompatibleWallet(session.walletName, session.walletAddress);
		const umbraClientSession = await createUmbraClientSession({ signer: connectedWallet.signer });
		const registrationSignatures = await registerUmbraUser(umbraClientSession);
		const nextSession = {
			...umbraClientSession,
			walletAddress: connectedWallet.walletAddress,
			walletName: connectedWallet.wallet.name,
			registrationSignatures
		};

		setActiveUmbraClientSession(nextSession);
		return nextSession;
	} catch (walletStandardError) {
		// Fallback: try direct wallet connection
		try {
			const signer = createSignerFromDirectWallet(session.walletName, session.walletAddress);
			const umbraClientSession = await createUmbraClientSession({ signer });
			const registrationSignatures = await registerUmbraUser(umbraClientSession);
			const nextSession = {
				...umbraClientSession,
				walletAddress: session.walletAddress,
				walletName: session.walletName,
				registrationSignatures
			};

			setActiveUmbraClientSession(nextSession);
			return nextSession;
		} catch (directWalletError) {
			// Both paths failed
			throw new Error(
				`Failed to connect ${session.walletName}. ` +
				`Wallet Standard error: ${walletStandardError instanceof Error ? walletStandardError.message : String(walletStandardError)}. ` +
				`Direct connection error: ${directWalletError instanceof Error ? directWalletError.message : String(directWalletError)}`
			);
		}
	}
}
