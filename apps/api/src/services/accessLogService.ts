import { listAccessLogsForDao } from "../repositories/accessLogRepository.js";
import { requireDaoById } from "./daoService.js";

export async function getDaoAccessLogs(daoId: string) {
  await requireDaoById(daoId);
  return listAccessLogsForDao(daoId);
}
