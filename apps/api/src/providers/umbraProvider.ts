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

export interface UmbraProvider {
  issueDisclosureGrant(input: DisclosureGrantInput): Promise<DisclosureGrantResult>;
}
