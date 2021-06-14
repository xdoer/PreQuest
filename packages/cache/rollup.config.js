import typescript from 'rollup-plugin-typescript2'

const BUILD_TYPE = process.env.BUILD

const base = {
  input: 'src/index.ts', // 打包入口
  plugins: [typescript()],
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
