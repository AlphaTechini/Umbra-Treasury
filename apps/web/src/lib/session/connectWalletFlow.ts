import { createDao, getOwnerDaoByWalletAddress } from '$lib/api/daos';
import { ApiClientError } from '$lib/api/http';
import { createUser } from '$lib/api/users';
import { connectCompatibleWallet } from '$lib/umbra';
import { daoSession } from './daoSession';
import { walletSession } from './walletSession';

export type ConnectWalletFlowResult = {
	walletAddress: string;
	walletName: string;
	daoSlug: string;
};

export async function connectWalletAndLoadDao(walletName: string): Promise<ConnectWalletFlowResult> {
	const connectedWallet = await connectCompatibleWallet(walletName);
	const walletAddress = connectedWallet.walletAddress;
	const username = connectedWallet.account.label ?? connectedWallet.wallet.name;

	await createUser({ walletAddress, username });
	walletSession.connect(walletAddress);

	const dao = await loadOrCreateDao(walletAddress);
	daoSession.setActiveDao(dao);

	return {
		walletAddress,
		walletName: connectedWallet.wallet.name,
		daoSlug: dao.slug
	};
}

async function loadOrCreateDao(walletAddress: string) {
	try {
		const { dao } = await getOwnerDaoByWalletAddress(walletAddress);
		return dao;
	} catch (error) {
		if (!(error instanceof ApiClientError) || error.status !== 404) {
			throw error;
		}
	}

	const { dao } = await createDao({
		ownerWalletAddress: walletAddress,
		name: `Umbra Treasury ${shortAddress(walletAddress)}`,
		slug: createDefaultDaoSlug(walletAddress),
		treasuryAddress: walletAddress,
		baseToken: 'usdc',
		description: 'Default private treasury workspace created from wallet connection.',
		isPublic: true
	});

	return dao;
}

function createDefaultDaoSlug(walletAddress: string) {
	const slugSafeAddress = walletAddress.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
	return `dao-${slugSafeAddress.slice(0, 20)}-${stableAddressHash(walletAddress)}`;
}

function shortAddress(walletAddress: string) {
	if (walletAddress.length <= 12) {
		return walletAddress;
	}

	return `${walletAddress.slice(0, 4)}...${walletAddress.slice(-4)}`;
}

function stableAddressHash(walletAddress: string) {
	let hash = 5381;

	for (let index = 0; index < walletAddress.length; index += 1) {
		hash = (hash * 33) ^ walletAddress.charCodeAt(index);
	}

	return (hash >>> 0).toString(36);
}
