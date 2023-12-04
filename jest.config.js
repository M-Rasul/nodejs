module.exports = {
    testEnvironment: 'node',
    roots: ['./'],
    preset: 'ts-jest',
    collectCoverageFrom: ['./'],
    coverageReporters: ['text'],
    coverageThreshold: {
        global: {
          lines: 90
        }
    },
};