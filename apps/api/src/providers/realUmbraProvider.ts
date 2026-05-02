import { getUmbraClient, type IUmbraClient, type IUmbraSigner } from "@umbra-privacy/sdk";
import {
  getUserRegistrationFunction,
  getPublicBalanceToEncryptedBalanceDirectDepositorFunction,
  getEncryptedBalanceToPublicBalanceDirectWithdrawerFunction,
  getEncryptedBalanceQuerierFunction,
  getComplianceGrantIssuerFunction,
} from "@umbra-privacy/sdk";
import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import type {
  DepositInput,
  DepositResult,
  DisclosureGrantInput,
  DisclosureGrantResult,
  QueryBalanceInput,
  QueryBalanceResult,
  RegisterUserInput,
  RegisterUserResult,
  UmbraProvider,
  WithdrawInput,
  WithdrawResult,
} from "./umbraProvider.js";

export class RealUmbraProvider implements UmbraProvider {
  private clientCache = new Map<string, IUmbraClient>();

  private getDefaultIndexerUrl(): string {
    if (env.UMBRA_INDEXER_URL) {
      return env.UMBRA_INDEXER_URL;
    }
    return env.UMBRA_NETWORK === "mainnet"
      ? "https://utxo-indexer.api.umbraprivacy.com"
      : "https://utxo-indexer.api-devnet.umbraprivacy.com";
  }

  private getDefaultRpcHttpUrl(): string {
    if (env.UMBRA_RPC_HTTP_URL) {
      return env.UMBRA_RPC_HTTP_URL;
    }
    return env.UMBRA_NETWORK === "mainnet"
      ? "https://api.mainnet-beta.solana.com"
      : "https://api.devnet.solana.com";
  }

  private getDefaultRpcWsUrl(): string {
    if (env.UMBRA_RPC_WS_URL) {
      return env.UMBRA_RPC_WS_URL;
    }
    return env.UMBRA_NETWORK === "mainnet"
      ? "wss://api.mainnet-beta.solana.com"
      : "wss://api.devnet.solana.com";
  }

  private async getClient(walletAddress: string, signer: IUmbraSigner): Promise<IUmbraClient> {
    const cached = this.clientCache.get(walletAddress);
    if (cached) {
      return cached;
    }

    const client = await getUmbraClient({
      signer,
      network: env.UMBRA_NETWORK,
      rpcUrl: this.getDefaultRpcHttpUrl(),
      rpcSubscriptionsUrl: this.getDefaultRpcWsUrl(),
      indexerApiEndpoint: this.getDefaultIndexerUrl(),
    });

    this.clientCache.set(walletAddress, client);
    return client;
  }

  async registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
    throw new ApiError(
      501,
      "Real Umbra user registration requires wallet signer integration - not yet implemented in backend-only context",
    );
  }

  async deposit(input: DepositInput): Promise<DepositResult> {
    throw new ApiError(
      501,
      "Real Umbra deposit requires wallet signer integration - not yet implemented in backend-only context",
    );
  }

  async withdraw(input: WithdrawInput): Promise<WithdrawResult> {
    throw new ApiError(
      501,
      "Real Umbra withdraw requires wallet signer integration - not yet implemented in backend-only context",
    );
  }

  async queryBalance(input: QueryBalanceInput): Promise<QueryBalanceResult> {
    throw new ApiError(
      501,
      "Real Umbra balance query requires wallet signer integration - not yet implemented in backend-only context",
    );
  }

  async issueDisclosureGrant(input: DisclosureGrantInput): Promise<DisclosureGrantResult> {
    throw new ApiError(
      501,
      "Real Umbra compliance grant issuance requires wallet signer integration - not yet implemented in backend-only context",
    );
  }
}
