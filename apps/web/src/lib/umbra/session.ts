import type { UmbraClientSession } from './client';

export type ActiveUmbraClientSession = UmbraClientSession & {
	walletAddress: string;
	walletName: string;
	registrationSignatures: string[];
};

let activeUmbraClientSession: ActiveUmbraClientSession | null = null;

export function setActiveUmbraClientSession(session: ActiveUmbraClientSession) {
	activeUmbraClientSession = session;
}

export function getActiveUmbraClientSession() {
	return activeUmbraClientSession;
}

export function clearActiveUmbraClientSession() {
	activeUmbraClientSession = null;
}
