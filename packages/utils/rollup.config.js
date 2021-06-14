import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const base = {
  input: 'src/index.ts', // 打包入口
  plugins: [typescript(), terser()],
}

export default [
  {
    ...base,
    output: { exports: 'auto', file: 'dist/index.cjs.js', format: 'cjs' },
  },
  {
    ...base,
    output: { exports: 'auto', file: 'dist/index.esm.js', format: 'esm' },
  },
]
