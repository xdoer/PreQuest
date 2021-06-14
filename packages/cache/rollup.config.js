import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'

const BUILD_TYPE = process.env.BUILD

const base = {
  input: 'src/index.ts', // 打包入口
  plugins: [typescript(), terser()],
}

const config = {
  cjs: {
    ...base,
    output: { file: 'dist/index.cjs.js', format: 'cjs', exports: 'auto' },
  },
  esm: {
    ...base,
    output: { file: 'dist/index.esm.js', format: 'esm', exports: 'auto' },
  },
}

export default config[BUILD_TYPE]
