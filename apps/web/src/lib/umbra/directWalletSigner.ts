import type { IUmbraSigner } from '@umbra-privacy/sdk/interfaces';
import type { SignableTransaction, SignedMessage } from './client';
import { getProvider, getWalletAdapter } from './directWalletDetection';

export function createSignerFromDirectWallet(walletName: string, walletAddress: string): IUmbraSigner {
	const adapter = getWalletAdapter(walletName);
	if (!adapter) {
		throw new Error(`Unknown wallet: ${walletName}`);
	}

	const provider = getProvider(adapter);
	if (!provider) {
		throw new Error(`${walletName} provider not found`);
	}

	return {
		address: walletAddress,
		
		async signTransaction(transaction: SignableTransaction): Promise<SignableTransaction> {
			// Convert the Umbra SDK transaction format to the wallet provider format
			// Most wallets expect a Transaction object from @solana/web3.js
			const signed = await provider.signTransaction(transaction);
			return signed;
		},
		
		async signMessage(message: Uint8Array): Promise<SignedMessage> {
			const result = await provider.signMessage(message);
			
			// Different wallets return different formats
			// Phantom: { signature: Uint8Array, publicKey: PublicKey }
			// Solflare: { signature: Uint8Array }
			const signature = result.signature ?? result;
			
			if (!(signature instanceof Uint8Array)) {
				throw new Error(`${walletName} returned invalid signature format`);
			}
			
			return {
				message,
				signature,
				signer: walletAddress
			};
		}
	};
}
