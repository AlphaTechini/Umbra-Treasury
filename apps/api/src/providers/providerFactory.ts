import { env } from "../config/env.js";
import { ApiError } from "../utils/apiError.js";
import { MockUmbraProvider } from "./mockUmbraProvider.js";
import type { UmbraProvider } from "./umbraProvider.js";

export function createUmbraProvider(): UmbraProvider {
  if (env.UMBRA_MODE === "mock") {
    return new MockUmbraProvider();
  }

  throw new ApiError(501, "Real Umbra provider is not implemented yet");
}
