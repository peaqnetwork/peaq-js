/* eslint-disable */
export default {
  displayName: 'sdk',
  preset: '../../jest.preset.js',
  transform: {
    '^.+\\.[tj]s$': ['ts-jest', { tsconfig: '<rootDir>/tsconfig.spec.json' }],
  },
  moduleFileExtensions: ['ts', 'js', 'html', 'd.ts'],
  coverageDirectory: '../../coverage/packages/sdk',
  collectCoverage: true
};
