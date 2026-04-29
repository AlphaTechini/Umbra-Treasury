import { getUmbraClient, type GetUmbraClientDeps } from '@umbra-privacy/sdk';
import type { IUmbraClient, IUmbraSigner } from '@umbra-privacy/sdk/interfaces';
import { getUmbraPublicConfig, type UmbraPublicConfig } from './config';

export type UmbraClientSession = {
	client: IUmbraClient;
	config: UmbraPublicConfig;
};

export type CreateUmbraClientSessionInput = {
	signer: IUmbraSigner;
	config?: UmbraPublicConfig;
	deps?: GetUmbraClientDeps;
	deferMasterSeedSignature?: boolean;
};

export async function createUmbraClientSession({
	signer,
	config = getUmbraPublicConfig(),
	deps,
	deferMasterSeedSignature = true
}: CreateUmbraClientSessionInput): Promise<UmbraClientSession> {
	const client = await getUmbraClient(
		{
			signer,
			network: config.network,
			rpcUrl: config.rpcUrl,
			rpcSubscriptionsUrl: config.rpcSubscriptionsUrl,
			indexerApiEndpoint: config.indexerApiEndpoint,
			deferMasterSeedSignature
		},
		deps
	);

	return { client, config };
}
