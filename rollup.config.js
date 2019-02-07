// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
const dependencies = Object.keys(require('./package.json').dependencies)

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/quamm-client-javascript.js',
    format: 'cjs',
    export: 'named'
  },
  external: [ 'http', 'https', 'url', 'assert', 'stream', 'tty', 'util', 'os', 'zlib', '@babel/runtime/regenerator' ],
  plugins: [
    resolve({ //https://github.com/rollup/rollup-plugin-node-resolve
      preferBuiltins: true,
      browser: true
    }),
    commonjs(),
    json(),
    babel({
      runtimeHelpers: true, // https://github.com/rollup/rollup-plugin-babel
      plugins: [
        '@babel/plugin-transform-runtime' // https://babeljs.io/docs/en/babel-plugin-transform-runtime
      ],
      exclude: 'node_modules/**' // only transpile our source code
    }),
  ]
};