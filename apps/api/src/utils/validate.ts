import type { z } from "zod";
import { badRequest } from "./apiError.js";

export function parseBody<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw badRequest(issue?.message ?? "Invalid request body");
  }

  return result.data;
}

export function parseParams<T extends z.ZodType>(schema: T, value: unknown): z.infer<T> {
  const result = schema.safeParse(value);

  if (!result.success) {
    const issue = result.error.issues[0];
    throw badRequest(issue?.message ?? "Invalid route parameters");
  }

  return result.data;
}
