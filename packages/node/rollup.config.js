import typescript from '@rollup/plugin-typescript'
import commonjs from 'rollup-plugin-commonjs'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'src/index.ts', // 打包入口
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: production,
  },
  plugins: [commonjs(), typescript()],
}
