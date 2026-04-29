import {
	getComplianceGrantIssuerFunction,
	getComplianceGrantRevokerFunction,
	getUserComplianceGrantQuerierFunction
} from '@umbra-privacy/sdk';
import {
	assertOptionalData32,
	assertRcEncryptionNonce,
	assertX25519PublicKey,
	type OptionalData32,
	type RcEncryptionNonce,
	type X25519PublicKey
} from '@umbra-privacy/sdk/crypto';
import { hexToBytes } from './bytes';
import type { UmbraClientSession } from './client';

type GrantIssuer = ReturnType<typeof getComplianceGrantIssuerFunction>;
type GrantAddress = Parameters<GrantIssuer>[0];

export type UmbraComplianceGrantInput = {
	receiverAddress: string;
	granterX25519PublicKeyHex: string;
	receiverX25519PublicKeyHex: string;
	nonce: bigint;
	optionalDataHex?: string;
};

function toGrantAddress(address: string): GrantAddress {
	if (!address.trim()) {
		throw new Error('receiverAddress is required');
	}

	return address.trim() as GrantAddress;
}

function toX25519PublicKey(hex: string, label: string): X25519PublicKey {
	const bytes = hexToBytes(hex, 32, label);
	assertX25519PublicKey(bytes);
	return bytes;
}

function toComplianceNonce(nonce: bigint): RcEncryptionNonce {
	assertRcEncryptionNonce(nonce, 'nonce');
	return nonce;
}

function toOptionalData(hex: string | undefined): OptionalData32 | undefined {
	if (!hex?.trim()) {
		return undefined;
	}

	const bytes = hexToBytes(hex, 32, 'optionalData');
	assertOptionalData32(bytes, 'optionalData');
	return bytes;
}

export async function issueUmbraComplianceGrant(
	session: UmbraClientSession,
	input: UmbraComplianceGrantInput
): Promise<string> {
	const issueGrant = getComplianceGrantIssuerFunction({ client: session.client });

	return issueGrant(
		toGrantAddress(input.receiverAddress),
		toX25519PublicKey(input.granterX25519PublicKeyHex, 'granterX25519PublicKeyHex'),
		toX25519PublicKey(input.receiverX25519PublicKeyHex, 'receiverX25519PublicKeyHex'),
		toComplianceNonce(input.nonce),
		toOptionalData(input.optionalDataHex)
	);
}

export async function revokeUmbraComplianceGrant(
	session: UmbraClientSession,
	input: UmbraComplianceGrantInput
): Promise<string> {
	const revokeGrant = getComplianceGrantRevokerFunction({ client: session.client });

	return revokeGrant(
		toGrantAddress(input.receiverAddress),
		toX25519PublicKey(input.granterX25519PublicKeyHex, 'granterX25519PublicKeyHex'),
		toX25519PublicKey(input.receiverX25519PublicKeyHex, 'receiverX25519PublicKeyHex'),
		toComplianceNonce(input.nonce),
		toOptionalData(input.optionalDataHex)
	);
}

export async function queryUmbraComplianceGrant(
	session: UmbraClientSession,
	input: Omit<UmbraComplianceGrantInput, 'receiverAddress' | 'optionalDataHex'>
) {
	const queryGrant = getUserComplianceGrantQuerierFunction({ client: session.client });

	return queryGrant(
		toX25519PublicKey(input.granterX25519PublicKeyHex, 'granterX25519PublicKeyHex'),
		toComplianceNonce(input.nonce),
		toX25519PublicKey(input.receiverX25519PublicKeyHex, 'receiverX25519PublicKeyHex')
	);
}
