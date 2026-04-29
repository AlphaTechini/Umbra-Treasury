import type { DisclosureGrantInput, DisclosureGrantResult, UmbraProvider } from "./umbraProvider.js";

export class MockUmbraProvider implements UmbraProvider {
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
