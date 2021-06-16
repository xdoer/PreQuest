import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

export default [
  {
    input: 'src/index.ts',
    external: ['@prequest/utils'],
    plugins: [nodeResolve(), commonjs(), typescript(), terser()],
    output: [
      { file: 'dist/index.js', format: 'cjs' },
      { file: 'dist/index.esm.js', format: 'esm' },
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
      },
      {
        file: 'dist/es5/index.esm.js',
        format: 'esm',
        plugins: [
          getBabelOutputPlugin({
            presets: ['@babel/preset-env'],
          }),
        ],
      },
    ],
  },
]
