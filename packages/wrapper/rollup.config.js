import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'src/index.ts',
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    output: [
      { file: 'dist/index.js', format: 'cjs', exports: 'auto' },
      { file: 'dist/index.esm.js', format: 'esm', exports: 'auto' },
      { file: 'dist/index.umd.js', format: 'umd', name: 'wrapper', exports: 'auto' },
    ],
  },
  {
    input: 'src/index.ts',
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ tsconfigOverride: { compilerOptions: { declaration: false } } }),
      terser(),
    ],
    output: [
      {
        file: 'dist/es5/index.js',
        format: 'cjs',
        plugins: [
          getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
          }),
        ],
        exports: 'auto',
      },
      {
        file: 'dist/es5/index.esm.js',
        format: 'esm',
        plugins: [
          getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
          }),
        ],
        exports: 'auto',
      },
      {
        file: 'dist/es5/index.umd.js',
        format: 'umd',
        name: 'wrapper',
        plugins: [
          getBabelOutputPlugin({
            allowAllFormats: true,
            presets: [['@babel/preset-env', { modules: 'umd' }]],
          }),
        ],
        exports: 'auto',
      },
    ],
  },
]
