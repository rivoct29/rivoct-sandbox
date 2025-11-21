import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Exclude web tests from root - they need jsdom and should run in their own config
    exclude: ['**/node_modules/**', '**/dist/**', '**/lib/**', 'web/**'],
    globals: true,
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        '**/node_modules/**',
        '**/lib/**',
        '**/*.config.*',
        '**/dist/**',
        '**/.next/**',
        '**/out/**',
      ],
    },
  },
});
