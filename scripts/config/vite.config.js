const {defineConfig} = require('vite');
const path = require('path');
const react = require('@vitejs/plugin-react');
const legacy = require('@vitejs/plugin-legacy');
const {injectHtml} = require('vite-plugin-html');
const styleImporter = require('vite-plugin-style-import').default;
const eslint = require('vite-plugin-eslint').default;
const inject = require('@rollup/plugin-inject');
const visualizer = require('rollup-plugin-visualizer').default;

module.exports = (NODE_ENV, currentConfig) => (mergeConfig) => {
  const isDev = NODE_ENV === 'development';

  return defineConfig({
    root: currentConfig.root, // 项目根目录 index.html 文件所在位置
    base: currentConfig.base, // 服务的公共基础路径（一般用来定义部署网站的子路径）
    mode: NODE_ENV, // 确定构建的模式 development 或者 production
    resolve: { // 文件别名
      alias: currentConfig.alias,
      preserveSymlinks: true
    },
    envDir: currentConfig.envDir, // 加载 .env 文件的目录
    envPrefix: currentConfig.envPrefix, // .env 文件中环境变量格式
    css: {
      preprocessorOptions: { // 样式预处理器的配置
        less: {
          javascriptEnabled: true,
          globalVars: {
            cdnUrl: JSON.stringify('https://www.baidu.com'),
          },
        },
      },
    },
    // 定义全局常量，环境变量可以使用 .env 文件来实现
    define: {
      RUNTIME_NODE_ENV: JSON.stringify(NODE_ENV), // 这里只是案例 TODO
    },
    cacheDir: path.join(currentConfig.cacheDir, 'vite'), // 缓存所在目录
    publicDir: currentConfig.publicDir, // 静态资源服务文件夹，文件下资源可以 / 处提供 TODO
    logLevel: 'info',
    plugins: [
      inject({
        exclude: /\.less/,
        include: /\.[tj]sx?$/,
        _: 'lodash',
        mobx: ['mobx', '*'],
        React: ['react', '*'],
      }),
      injectHtml({
        data: currentConfig.htmlParameter || {},
      }),
      styleImporter({
        libs: [
          {
            libraryName: 'antd',
            esModule: true,
            resolveStyle: name => `antd/es/${name}/style/index`
          }
        ]
      }),
      react(),
      {
        ...eslint({
          fix: false,
          cache: true,
          cacheLocation: path.join(currentConfig.cacheDir, 'eslint'),
          formatter: 'stylish',
          throwOnWarning: isDev,
        }), enforce: 'pre'
      },
      currentConfig.legacy ? legacy({additionalLegacyPolyfills: ['regenerator-runtime/runtime']}) : undefined,
      currentConfig.report ? visualizer({
        open: true,
        template: 'treemap',
        gzipSize: true,
        brotliSize: true,
        filename: `${currentConfig.reportPath}/${NODE_ENV}/report.html`
      }) : undefined,
    ],
    ...(mergeConfig || {}),
  })
}