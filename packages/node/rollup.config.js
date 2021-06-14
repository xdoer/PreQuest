import typescript from 'rollup-plugin-typescript2'
import { terser } from 'rollup-plugin-terser'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'src/index.ts', // 打包入口
  output: {
    dir: 'dist',
    format: 'esm',
  },
  plugins: [commonjs(), typescript()],
}
