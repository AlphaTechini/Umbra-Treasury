import { env } from '$env/dynamic/public';

export type UmbraNetwork = 'mainnet' | 'devnet' | 'localnet';

export type UmbraPublicConfig = {
	network: UmbraNetwork;
	rpcUrl: string;
	rpcSubscriptionsUrl: string;
	indexerApiEndpoint?: string;
};

const supportedNetworks = new Set<UmbraNetwork>(['mainnet', 'devnet', 'localnet']);

function requirePublicEnv(value: string | undefined, name: string) {
	if (!value?.trim()) {
		throw new Error(`${name} is required before creating an Umbra client`);
	}

	return value.trim();
}

function parseUmbraNetwork(value: string | undefined): UmbraNetwork {
	const network = requirePublicEnv(value, 'PUBLIC_UMBRA_NETWORK');

	if (!supportedNetworks.has(network as UmbraNetwork)) {
		throw new Error('PUBLIC_UMBRA_NETWORK must be mainnet, devnet, or localnet');
	}

	return network as UmbraNetwork;
}

export function getUmbraPublicConfig(): UmbraPublicConfig {
	const indexerApiEndpoint = env.PUBLIC_UMBRA_INDEXER_URL?.trim();

	return {
		network: parseUmbraNetwork(env.PUBLIC_UMBRA_NETWORK),
		rpcUrl: requirePublicEnv(env.PUBLIC_UMBRA_RPC_HTTP_URL, 'PUBLIC_UMBRA_RPC_HTTP_URL'),
		rpcSubscriptionsUrl: requirePublicEnv(env.PUBLIC_UMBRA_RPC_WS_URL, 'PUBLIC_UMBRA_RPC_WS_URL'),
		...(indexerApiEndpoint ? { indexerApiEndpoint } : {})
	};
}
