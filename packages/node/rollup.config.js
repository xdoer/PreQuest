import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from '@rollup/plugin-commonjs'

const base = {
  input: 'src/index.ts', // 打包入口
  plugins: [commonjs(), typescript(), terser()],
}

export default [
  {
    ...base,
    output: { file: 'dist/index.cjs.js', format: 'cjs', exports: 'auto' },
  },
  {
    ...base,
    output: { file: 'dist/index.esm.js', format: 'esm', exports: 'auto' },
  },
]
