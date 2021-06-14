import typescript from '@rollup/plugin-typescript'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.ts', // 打包入口
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: production,
  },
  plugins: [typescript()],
}
