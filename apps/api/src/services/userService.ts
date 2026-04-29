import { findUserByWalletAddress, upsertUser } from "../repositories/userRepository.js";
import { notFound } from "../utils/apiError.js";

export async function getOrCreateUser(input: { walletAddress: string; username?: string | undefined }) {
  return upsertUser(input);
}

export async function getUserByWalletAddress(walletAddress: string) {
  const user = await findUserByWalletAddress(walletAddress);

  if (!user) {
    throw notFound("User not found");
  }

  return user;
}
