'use strict';

/*
 * npm build ...
 * */

// 设置环境变量
process.env.NODE_ENV = 'production';

// promise reject 报错未 catch 的处理
process.on('unhandledRejection', (err) => {
  throw err;
});

const _ = require('lodash');
const path = require('path');
const {build} = require('vite');
const viteConfig = require('./config/vite.config');
const pathConfig = require('./config/paths.config');
const {parseCommandLine} = require('./utils/parseCommandLine');

const params = parseCommandLine();
const prodConfig = pathConfig(process.env.NODE_ENV);

_.set(prodConfig, 'report', params['report']);
_.set(prodConfig, 'legacy', params['legacy']);
_.set(prodConfig, 'htmlParameter', {
  MAIN_API_URL: 'https://www.baidu.com' // 测试 html 模板传参
});


// 开始构建
;(async () => {
  await build(viteConfig(process.env.NODE_ENV, prodConfig)({
    configFile: false, // 不读取配置文件
    build: {
      outDir: prodConfig.outDir, // 指定输出路径
      assetsDir: prodConfig.assetsDir, // 一个相对于 outDir 的静态资源输出路径
      cssCodeSplit: true, // 输出的 css 是否是经过 拆分的
      sourcemap: true,
      emptyOutDir: true, // 构建时清空目标文件夹
      chunkSizeWarningLimit: 500,
      rollupOptions: {
        output: {
          manualChunks: { // 自定义一些可以空想 chunk, 默认只拆出一个 vendor
            basic: ['react', 'react-dom', 'react-router-dom', 'mobx', 'mobx-react'],
            vendor: ['antd', 'axios', 'lodash', 'qs']
          },
          chunkFileNames: path.join(prodConfig.assetsDir, 'chunk/[name]-[hash].js'),
          entryFileNames: path.join(prodConfig.assetsDir, 'js/[name]-[hash].js'),
          assetFileNames: path.join(prodConfig.assetsDir, '[ext]/[name]-[hash].[ext]')
        }
      }
    },
  }));
})()