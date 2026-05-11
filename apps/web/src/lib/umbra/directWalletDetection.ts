import { browser } from '$app/environment';

export type SolanaWallet = {
	name: string;
	icon: string; // Lucide icon name
	adapter: string;
	isInstalled: boolean;
};

const POPULAR_WALLETS = [
	{ name: 'Phantom',        icon: 'Ghost',           adapter: 'phantom' },
	{ name: 'Solflare',       icon: 'Flame',           adapter: 'solflare' },
	{ name: 'Backpack',       icon: 'Backpack',        adapter: 'backpack' },
	{ name: 'Glow',           icon: 'Sparkles',        adapter: 'glow' },
	{ name: 'Coinbase Wallet',icon: 'CircleDollarSign', adapter: 'coinbaseSolana' },
];

// Each wallet injects itself differently into window
export function getProvider(adapter: string): any {
	if (!browser) return null;
	const w = window as any;

	if (adapter === 'phantom') {
		// Phantom injects under window.phantom.solana; older versions use window.solana
		return w.phantom?.solana ?? (w.solana?.isPhantom ? w.solana : null);
	}
	if (adapter === 'solflare') {
		return w.solflare ?? null;
	}
	if (adapter === 'backpack') {
		return w.backpack ?? w.xnft?.solana ?? null;
	}
	if (adapter === 'glow') {
		return w.glow ?? null;
	}
	if (adapter === 'coinbaseSolana') {
		return w.coinbaseSolana ?? null;
	}
	return null;
}

export function detectInstalledWallets(): SolanaWallet[] {
	if (!browser) return [];

	return POPULAR_WALLETS.map((wallet) => ({
		...wallet,
		isInstalled: Boolean(getProvider(wallet.adapter)),
	}));
}

export async function connectDirectWallet(walletName: string): Promise<string> {
	if (!browser) throw new Error('Cannot connect wallet outside browser');

	const wallet = POPULAR_WALLETS.find((w) => w.name === walletName);
	if (!wallet) throw new Error(`${walletName} is not a supported wallet`);

	const provider = getProvider(wallet.adapter);
	if (!provider) throw new Error(`${walletName} is not installed`);

	await provider.connect();

	// Wallets differ in where they expose publicKey after connect
	const publicKey =
		provider.publicKey?.toString?.() ??       // Phantom, Solflare, Backpack
		provider.accounts?.[0]?.address ??         // some Wallet Standard adapters
		null;

	if (!publicKey) {
		throw new Error(`${walletName} connected but did not return a public key`);
	}

	return publicKey;
}

export function getWalletInstallUrl(walletName: string): string {
	const urls: Record<string, string> = {
		'Phantom':        'https://phantom.app/download',
		'Solflare':       'https://solflare.com/download',
		'Backpack':       'https://backpack.app/downloads',
		'Glow':           'https://glow.app',
		'Coinbase Wallet':'https://www.coinbase.com/wallet/downloads',
	};
	return urls[walletName] ?? 'https://solana.com/ecosystem/explore?categories=wallet';
}

export function getWalletAdapter(walletName: string): string | null {
	const wallet = POPULAR_WALLETS.find((w) => w.name === walletName);
	return wallet?.adapter ?? null;
}
