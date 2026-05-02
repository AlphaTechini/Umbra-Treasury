import { env } from "../config/env.js";
import { MockUmbraProvider } from "./mockUmbraProvider.js";
import { RealUmbraProvider } from "./realUmbraProvider.js";
import type { UmbraProvider } from "./umbraProvider.js";

export function createUmbraProvider(): UmbraProvider {
  if (env.UMBRA_MODE === "mock") {
    return new MockUmbraProvider();
  }

  return new RealUmbraProvider();
}
