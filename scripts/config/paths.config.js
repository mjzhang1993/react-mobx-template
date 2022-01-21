'use strict';
/*
   开发配置文件
*/
const path = require('path');

module.exports = (NODE_ENV) => {
  const isDev = NODE_ENV === 'development';
  const context = path.resolve(__dirname, '../../');

  return {
    context,
    sourceCode: path.join(context, 'src'),
    root: path.join(context, 'src'),
    base: '/',
    outDir: path.join(context, isDev ? 'dev' : 'build'),
    assetsDir: 'static',
    publicDir: path.join(context, 'public'),
    envDir: path.join(context, 'env'),
    envPrefix: 'VITE_ENV_',
    reportPath: path.join(context, 'report'),
    cacheDir: path.join(context, `node_modules/.vite`),
    htmlParameter: {},
    report: false,
    legacy: true,
    alias: {
      store: path.join(context, 'src/store')
    },
  }
};
