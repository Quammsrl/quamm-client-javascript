// rollup.config.js
import commonjs from 'rollup-plugin-commonjs';
import json from 'rollup-plugin-json';
import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';

export default {
  input: 'src/index.js',
  output: {
    file: 'dist/quamm-client-javascript.js',
    format: 'cjs'
  },
  plugins: [
    resolve(),
    commonjs(),
    json(),
    babel({
      exclude: 'node_modules/**' // only transpile our source code
    })
  ]
};