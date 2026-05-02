import { get } from 'svelte/store';
import {
	connectCompatibleWallet,
	createUmbraClientSession,
	getActiveUmbraClientSession,
	registerUmbraUser,
	setActiveUmbraClientSession,
	type ActiveUmbraClientSession
} from '$lib/umbra';
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
}
