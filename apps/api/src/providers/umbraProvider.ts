export type DisclosureGrantInput = {
  daoId: string;
  disclosureRequestId: string;
  requesterName: string;
  scope: string;
};

export type DisclosureGrantResult = {
  source: "umbra_compliance" | "mock";
  verificationStatus: "verified" | "unverified" | "failed";
  providerReference: string;
  generatedAt: string;
  notes: string[];
};

export type RegisterUserInput = {
  walletAddress: string;
  confidential: boolean;
  anonymous: boolean;
};

export type RegisterUserResult = {
  success: boolean;
  userCommitment?: string;
};

export type DepositInput = {
  walletAddress: string;
  mint: string;
  amount: bigint;
};

export type DepositResult = {
  queueSignature: string;
  callbackSignature?: string;
};

export type WithdrawInput = {
  walletAddress: string;
  mint: string;
  amount: bigint;
};

export type WithdrawResult = {
  queueSignature: string;
  callbackSignature?: string;
};

export type QueryBalanceInput = {
  walletAddress: string;
  mint: string;
};

export type QueryBalanceResult = {
  balance: bigint;
};

export interface UmbraProvider {
  registerUser(input: RegisterUserInput): Promise<RegisterUserResult>;
  deposit(input: DepositInput): Promise<DepositResult>;
  withdraw(input: WithdrawInput): Promise<WithdrawResult>;
  queryBalance(input: QueryBalanceInput): Promise<QueryBalanceResult>;
  issueDisclosureGrant(input: DisclosureGrantInput): Promise<DisclosureGrantResult>;
}
