import { browser } from '$app/environment';
import { getWallets } from '@wallet-standard/app';
import { createUmbraSignerFromWalletAccount, type UmbraWallet, type UmbraWalletAccount } from './walletSigner';

const standardConnectFeature = 'standard:connect';
const solanaSignMessageFeature = 'solana:signMessage';
const solanaSignTransactionFeature = 'solana:signTransaction';
const solanaChainPrefix = 'solana:';

type WalletFeatureMap = Record<string, unknown>;

type ConnectFeature = {
	connect(input?: { silent?: boolean }): Promise<{ accounts: readonly UmbraWalletAccount[] }>;
};

export type CompatibleWallet = UmbraWallet & {
	name: string;
	icon: string;
	features: WalletFeatureMap;
	accounts: readonly UmbraWalletAccount[];
};

export type ConnectedWallet = {
	wallet: CompatibleWallet;
	account: UmbraWalletAccount;
	walletAddress: string;
	signer: ReturnType<typeof createUmbraSignerFromWalletAccount>;
};

export function getCompatibleWallets() {
	if (!browser) {
		return [];
	}

	return getWallets().get().filter(isCompatibleWallet);
}

export function watchCompatibleWallets(onChange: (wallets: CompatibleWallet[]) => void) {
	if (!browser) {
		onChange([]);
		return () => {};
	}

	const wallets = getWallets();
	const emitWallets = () => onChange(getCompatibleWallets());

	emitWallets();
	const offRegister = wallets.on('register', emitWallets);
	const offUnregister = wallets.on('unregister', emitWallets);

	return () => {
		offRegister();
		offUnregister();
	};
}

export async function connectCompatibleWallet(walletName: string): Promise<ConnectedWallet> {
	const wallet = getCompatibleWallets().find((candidate) => candidate.name === walletName);

	if (!wallet) {
		throw new Error(`${walletName} is not available in this browser.`);
	}

	const connectFeature = wallet.features[standardConnectFeature];

	if (!isConnectFeature(connectFeature)) {
		throw new Error(`${wallet.name} does not support wallet connection.`);
	}

	const { accounts } = await connectFeature.connect();
	const account = findCompatibleAccount(wallet, accounts);

	if (!account) {
		throw new Error(`${wallet.name} did not return a compatible Solana account.`);
	}

	return {
		wallet,
		account,
		walletAddress: account.address,
		signer: createUmbraSignerFromWalletAccount(wallet, account)
	};
}

function isCompatibleWallet(wallet: UmbraWallet): wallet is CompatibleWallet {
	const candidate = wallet as CompatibleWallet;
	const features = candidate.features;

	return (
		typeof candidate.name === 'string' &&
		typeof candidate.icon === 'string' &&
		Boolean(features?.[standardConnectFeature]) &&
		Boolean(features?.[solanaSignMessageFeature]) &&
		Boolean(features?.[solanaSignTransactionFeature]) &&
		findCompatibleAccount(candidate, candidate.accounts) !== null
	);
}

function findCompatibleAccount(wallet: CompatibleWallet, accounts: readonly UmbraWalletAccount[] = []) {
	return (
		accounts.find((account) => accountSupportsUmbra(account)) ??
		wallet.accounts.find((account) => accountSupportsUmbra(account)) ??
		null
	);
}

function accountSupportsUmbra(account: UmbraWalletAccount) {
	const chains = Array.from(account.chains ?? []);
	const features = Array.from(account.features ?? []);

	return (
		account.address.length > 0 &&
		chains.some((chain) => String(chain).startsWith(solanaChainPrefix)) &&
		features.includes(solanaSignMessageFeature) &&
		features.includes(solanaSignTransactionFeature)
	);
}

function isConnectFeature(feature: unknown): feature is ConnectFeature {
	return Boolean(feature && typeof feature === 'object' && 'connect' in feature && typeof feature.connect === 'function');
}
