import typescript from '@rollup/plugin-typescript';
import dts from 'rollup-plugin-dts';
import { terser } from 'rollup-plugin-terser';

// const compilerOptions: CompilerOptions = {
const compilerOptions = {
  outDir: "lib",
  declaration: true,
  declarationMap: true,
  sourceMap: true,
  removeComments: true,
  strict: false
};

export default [
  {
    input: 'src/index.ts',
    output: {
      file: 'lib/index.js',
      format: 'es',
      sourcemap: false
    },
    plugins: [
      typescript({ tsconfig: 'tsconfig.json', ...compilerOptions }),
      terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'lib/index.d.ts', format: 'es' }],
    plugins: [dts()],
  }];

