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

export class MockUmbraProvider implements UmbraProvider {
  async registerUser(input: RegisterUserInput): Promise<RegisterUserResult> {
    return {
      success: true,
      userCommitment: `mock-commitment:${input.walletAddress}`,
    };
  }

  async deposit(input: DepositInput): Promise<DepositResult> {
    return {
      queueSignature: `mock-queue-sig:${input.walletAddress}:${input.mint}:${input.amount}`,
      callbackSignature: `mock-callback-sig:${input.walletAddress}:${input.mint}:${input.amount}`,
    };
  }

  async withdraw(input: WithdrawInput): Promise<WithdrawResult> {
    return {
      queueSignature: `mock-queue-sig:${input.walletAddress}:${input.mint}:${input.amount}`,
      callbackSignature: `mock-callback-sig:${input.walletAddress}:${input.mint}:${input.amount}`,
    };
  }

  async queryBalance(input: QueryBalanceInput): Promise<QueryBalanceResult> {
    return {
      balance: 0n,
    };
  }

  async issueDisclosureGrant(input: DisclosureGrantInput): Promise<DisclosureGrantResult> {
    return {
      source: "mock",
      verificationStatus: "unverified",
      providerReference: `mock-disclosure:${input.daoId}:${input.disclosureRequestId}`,
      generatedAt: new Date().toISOString(),
      notes: [
        "Mock disclosure output for demo workflow only.",
        "No Umbra compliance grant or protocol verification was issued.",
      ],
    };
  }
}
