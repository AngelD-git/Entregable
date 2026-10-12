import { defineConfig } from 'vitest/config';

// Un único worker reduce el costo de arranque y evita forks lentos en Windows.
export default defineConfig({ test: { pool: 'threads', maxWorkers: 1, fileParallelism: false } });
