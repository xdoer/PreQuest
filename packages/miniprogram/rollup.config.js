import typescript from 'rollup-plugin-typescript2'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import { getBabelOutputPlugin } from '@rollup/plugin-babel'
import { terser } from 'rollup-plugin-terser'

export default {
  input: 'src/index.ts', // 打包入口
  plugins: [
    nodeResolve(),
    typescript(),
    getBabelOutputPlugin({ presets: ['@babel/preset-env'] }),
    terser(),
  ],
  output: [
    { exports: 'auto', file: 'dist/index.js', format: 'cjs' },
    { exports: 'auto', file: 'dist/index.ems.js', format: 'es' },
  ],
}
