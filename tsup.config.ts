import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['lib/main.ts'],
  clean: true,
  dts: true,
  minify: true,
  format: ['cjs', 'esm'],
});
