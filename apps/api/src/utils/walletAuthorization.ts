import { ed25519 } from "@noble/curves/ed25519.js";
import bs58 from "bs58";
import { z } from "zod";
import { badRequest, forbidden } from "./apiError.js";

const appName = "umbra-treasury-disclosure";
const maxFutureSkewMs = 60_000;
const maxAuthorizationWindowMs = 15 * 60_000;

export const walletAuthorizationSchema = z.object({
  walletAddress: z.string().min(1),
  message: z.string().min(1),
  signature: z.string().min(1),
});

export type WalletAuthorization = z.infer<typeof walletAuthorizationSchema>;

export type WalletAction =
  | "treasury_transaction:create"
  | "disclosure:review"
  | "report:mock:create"
  | "report:umbra:create";

export type WalletAuthorizationExpectation = {
  action: WalletAction;
  walletAddress: string;
  daoId?: string | undefined;
  requestId?: string | undefined;
};

type WalletAuthorizationMessage = {
  app: string;
  action: string;
  walletAddress: string;
  daoId?: string | undefined;
  requestId?: string | undefined;
  issuedAt: string;
  expiresAt: string;
};

export function verifyWalletAuthorization(
  authorization: WalletAuthorization | undefined,
  expected: WalletAuthorizationExpectation,
): WalletAuthorizationMessage {
  if (!authorization) {
    throw forbidden("Wallet authorization is required");
  }

  if (authorization.walletAddress !== expected.walletAddress) {
    throw forbidden("Wallet authorization address does not match the request");
  }

  const message = parseAuthorizationMessage(authorization.message);
  assertExpectedMessage(message, expected);
  assertAuthorizationWindow(message);

  const publicKeyBytes = decodeBase58Bytes(authorization.walletAddress, 32, "walletAddress");
  const signatureBytes = decodeBase64Bytes(authorization.signature, 64, "signature");
  const signedMessageBytes = new TextEncoder().encode(authorization.message);

  if (!ed25519.verify(signatureBytes, signedMessageBytes, publicKeyBytes, { zip215: false })) {
    throw forbidden("Wallet authorization signature is invalid");
  }

  return message;
}

function parseAuthorizationMessage(message: string): WalletAuthorizationMessage {
  let parsed: unknown;

  try {
    parsed = JSON.parse(message);
  } catch {
    throw badRequest("Wallet authorization message must be valid JSON");
  }

  const result = z
    .object({
      app: z.literal(appName),
      action: z.string().min(1),
      walletAddress: z.string().min(1),
      daoId: z.string().min(1).optional(),
      requestId: z.string().min(1).optional(),
      issuedAt: z.string().datetime(),
      expiresAt: z.string().datetime(),
    })
    .safeParse(parsed);

  if (!result.success) {
    throw badRequest("Wallet authorization message is missing required fields");
  }

  return result.data;
}

function assertExpectedMessage(message: WalletAuthorizationMessage, expected: WalletAuthorizationExpectation): void {
  if (message.action !== expected.action) {
    throw forbidden("Wallet authorization action does not match the request");
  }

  if (message.walletAddress !== expected.walletAddress) {
    throw forbidden("Wallet authorization message address does not match the request");
  }

  if (expected.daoId && message.daoId !== expected.daoId) {
    throw forbidden("Wallet authorization DAO target does not match the request");
  }

  if (expected.requestId && message.requestId !== expected.requestId) {
    throw forbidden("Wallet authorization disclosure request target does not match the request");
  }
}

function assertAuthorizationWindow(message: WalletAuthorizationMessage): void {
  const now = Date.now();
  const issuedAt = Date.parse(message.issuedAt);
  const expiresAt = Date.parse(message.expiresAt);

  if (!Number.isFinite(issuedAt) || !Number.isFinite(expiresAt)) {
    throw badRequest("Wallet authorization timestamps are invalid");
  }

  if (issuedAt > now + maxFutureSkewMs) {
    throw forbidden("Wallet authorization was issued too far in the future");
  }

  if (expiresAt <= now) {
    throw forbidden("Wallet authorization has expired");
  }

  if (expiresAt - issuedAt > maxAuthorizationWindowMs) {
    throw forbidden("Wallet authorization expiry window is too long");
  }
}

function decodeBase58Bytes(value: string, expectedLength: number, label: string): Uint8Array {
  let bytes: Uint8Array;

  try {
    bytes = bs58.decode(value);
  } catch {
    throw badRequest(`${label} must be valid base58`);
  }

  if (bytes.length !== expectedLength) {
    throw badRequest(`${label} must decode to ${expectedLength} bytes`);
  }

  return bytes;
}

function decodeBase64Bytes(value: string, expectedLength: number, label: string): Uint8Array {
  const bytes = Buffer.from(value, "base64");

  if (bytes.length !== expectedLength) {
    throw badRequest(`${label} must decode to ${expectedLength} bytes`);
  }

  return bytes;
}
