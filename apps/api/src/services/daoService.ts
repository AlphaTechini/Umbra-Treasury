import { createAccessLog } from "../repositories/accessLogRepository.js";
import { createDao, findDaoById, findDaoBySlug } from "../repositories/daoRepository.js";
import { upsertUser } from "../repositories/userRepository.js";
import { notFound } from "../utils/apiError.js";
import { mapBaseToken } from "./enumMappers.js";

export type CreateDaoRequest = {
  ownerWalletAddress: string;
  ownerUsername?: string | undefined;
  name: string;
  slug: string;
  treasuryAddress?: string | undefined;
  baseToken: string;
  description?: string | undefined;
  isPublic?: boolean | undefined;
};

export async function createDaoWorkspace(input: CreateDaoRequest) {
  const owner = await upsertUser({
    walletAddress: input.ownerWalletAddress,
    username: input.ownerUsername,
  });

  const dao = await createDao({
    ownerId: owner.id,
    name: input.name,
    slug: input.slug,
    baseToken: mapBaseToken(input.baseToken),
    treasuryAddress: input.treasuryAddress,
    description: input.description,
    isPublic: input.isPublic,
  });

  await createAccessLog({
    daoId: dao.id,
    actorId: owner.id,
    action: "dao_created",
    targetType: "dao",
    targetId: dao.id,
    metadata: { slug: dao.slug },
  });

  return dao;
}

export async function getDaoBySlug(slug: string) {
  const dao = await findDaoBySlug(slug);

  if (!dao) {
    throw notFound("DAO not found");
  }

  return dao;
}

export async function requireDaoById(daoId: string) {
  const dao = await findDaoById(daoId);

  if (!dao) {
    throw notFound("DAO not found");
  }

  return dao;
}
