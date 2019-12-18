'use strict';

const Module = require('module');
const { dirname, resolve } = require('path');

const RollupPluginTypescript = require('@wessberg/rollup-plugin-ts');

const pkg = require('./package.json');

module.exports = [
  {
    input: resolve(__dirname, 'src/index.ts'),
    output: [
      {
        file: resolve(__dirname, pkg.main),
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: [...Object.keys(pkg.dependencies), ...Module.builtinModules],
    plugins: [RollupPluginTypescript({})],
  },
  {
    input: resolve(__dirname, 'src/transforms.ts'),
    output: [
      {
        file: resolve(__dirname, pkg.transforms),
        format: 'cjs',
        sourcemap: true,
      },
    ],
    external: [...Object.keys(pkg.dependencies), ...Module.builtinModules],
    plugins: [RollupPluginTypescript({})],
  }
];
