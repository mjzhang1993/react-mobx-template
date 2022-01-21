const yargs = require('yargs');
const legacy = require('@vitejs/plugin-legacy');

function parseCommandLine() {
  const processArgvs = process.argv.slice(2);

  if (!processArgvs) {
    return {};
  }

  yargs(processArgvs).options({
    port: {alias: 'p', describe: '端口号'},
    https: {describe: '是否启用https', type: 'boolean', default: false},
    legacy: {describe: '是否编译出兼容低版本浏览器的结果', type: 'boolean', default: false},
    report: {alias: 'r', describe: '打包后是否生成report(只适用于npm build)', type: 'boolean', default: false},
  });

  return yargs.help().argv;
}

module.exports = {parseCommandLine}