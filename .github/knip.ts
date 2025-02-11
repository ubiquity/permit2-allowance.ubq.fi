import type { KnipConfig } from "knip";

const config: KnipConfig = {
  entry: ["static/main.ts", ".github/empty-string-checker.ts"],
  project: ["src/**/*.ts"],
  ignore: ["src/types/config.ts", "**/__mocks__/**", "**/__fixtures__/**", "eslint.config.mjs"],
  ignoreExportsUsedInFile: true,
  // eslint can also be safely ignored as per the docs: https://knip.dev/guides/handling-issues#eslint--jest
  ignoreDependencies: ["dotenv", "@mswjs/data", "@ubiquity-dao/rpc-handler"],
  ignoreBinaries: ["cypress/scripts/anvil.sh"],
  eslint: true,
};

export default config;
