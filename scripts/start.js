'use strict';

/*
 * npm start ...
 * */

// 设置环境变量
process.env.NODE_ENV = 'development';

// promise reject 报错未 catch 的处理
process.on('unhandledRejection', (err) => {
  throw err;
});

const _ = require('lodash');
const {createServer} = require('vite');
const viteConfig = require('./config/vite.config');
const pathConfig = require('./config/paths.config');
const {parseCommandLine} = require('./utils/parseCommandLine');
const pkg = require('../package.json');

const params = parseCommandLine();
const devConfig = pathConfig(process.env.NODE_ENV);

_.set(devConfig, 'htmlParameter', {
  MAIN_API_URL: 'https://www.baidu.com' // 测试 html 模板传参
});

// 开始构建
;(async () => {
  const server = await createServer(viteConfig(process.env.NODE_ENV, devConfig)({
    configFile: false, // 不读取配置文件
    optimizeDeps: {
      include: Object.keys(pkg.dependencies)
    },
    server: {
      port: parseInt(params['port'], 10) || 3000,
      host: true,
      https: params['https'],
      proxy: {},
      open: true,
      fs: {strict: true},
      hmr: {
        overlay: false
      }
    },
  }))
  await server.listen()

  server.printUrls()
})()