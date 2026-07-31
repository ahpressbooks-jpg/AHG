import { defineConfig } from "vitest/config";

// Unit tests for the pure logic the brand's credibility rests on: the two
// scoring modules, the owner-counting rule, and the Aisle CROSSING match.
export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
