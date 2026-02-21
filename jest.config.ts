import type {Config} from "jest";
import nextJest from "next/jest.js";

const createJestConfig = nextJest({
  dir: "./",
});

const config: Config = {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: "coverage",

  collectCoverageFrom: [
    "src/**/*.{js,jsx,ts,tsx}",
    "!src/components/ui/**",
    "!src/**/*.d.ts",
    "!src/**/types.ts",
    "!src/generated/**",
    "!src/constants/**",
    "!src/features/global/server/params-loader.ts",
    "!src/instrumentation-client.ts",
    "!src/instrumentation.ts",
    "!src/test-utils.tsx",
    "!src/features/global/hooks/use-global-params.ts",
    "!src/app/api/**",
    "!src/trpc/**",
    "!src/features/global/params.ts",
    "!src/lib/auth/auth-client.ts",
    "!src/lib/auth/auth.ts",
    "!src/lib/auth/permissions.ts",
    "!src/hooks/**",
    "!src/lib/ai.ts",
    "!src/lib/db.ts",
    "!src/lib/polar.ts",
    "!src/lib/uploadthing.ts",
  ],

  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },

  setupFilesAfterEnv: ["<rootDir>/jest.setup.tsx"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [
    "node_modules/(?!(superjson|nuqs|@trpc|better-auth|@better-auth)/)",
  ],
};

export default createJestConfig(config);
