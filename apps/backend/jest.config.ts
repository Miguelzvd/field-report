import type { Config } from "jest"

const config: Config = {
  preset: "ts-jest",
  testEnvironment: "node",
  roots: ["<rootDir>/tests"],
  testMatch: ["**/*.test.ts"],
  moduleNameMapper: {
    "^@field-report/shared$":
      "<rootDir>/../../packages/shared/src/index.ts",
  },
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        tsconfig: {
          strict: true,
          esModuleInterop: true,
          baseUrl: ".",
          paths: {
            "@field-report/shared": [
              "../../packages/shared/src/index.ts",
            ],
          },
        },
      },
    ],
  },
  clearMocks: true,
  collectCoverageFrom: ["src/**/*.ts", "!src/**/*.d.ts"],
}

export default config
