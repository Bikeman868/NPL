import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        include: ['**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
        onConsoleLog(log: string, type: 'stdout' | 'stderr'): false | void {
            console.log('Test logged: ', log);
        },
    },
});
