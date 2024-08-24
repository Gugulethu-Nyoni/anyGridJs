import { nodeResolve } from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import terser from '@rollup/plugin-terser';

export default {
  input: 'src/anyGrid.js',
  output: [
    {
      file: 'dist/anyGrid.cjs.js',
      format: 'cjs',
      exports: 'auto',
      sourcemap: false,
    },
    {
      file: 'dist/anyGrid.umd.js',
      format: 'umd',
      name: 'AnyGrid',
      exports: 'auto',
      sourcemap: false,
    },
    {
      file: 'dist/anyGrid.mjs',
      format: 'esm',
    },
    {
      file: 'dist/anyGrid.global.js',
      format: 'iife',
      name: 'AnyGrid',
    },
  ],
  plugins: [
    nodeResolve(),
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    terser(),
    // Consider adding @rollup/plugin-commonjs if needed
  ],
};