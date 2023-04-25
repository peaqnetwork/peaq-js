/* eslint-disable */
import type { Config } from 'jest';
const config: Config = {
  displayName: 'sdk',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json', useEsm: true }],
  },
  "moduleNameMapper": {
    "^(\\.\\.?\\/.+)\\.js$": "$1",
  },
  extensionsToTreatAsEsm: ['.ts'],
  moduleFileExtensions: ['ts', 'js', 'html', 'd.ts'],
  coverageDirectory: '../../coverage/packages/sdk',
  collectCoverage: true,
};

export default config;
