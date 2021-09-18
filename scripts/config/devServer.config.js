/*
 * dev-server 配置
 * */

module.exports = (option) => {
  return {
    devMiddleware: {
      mimeTypes: {ts: 'application/javascript', tsx: 'application/javascript'},
      publicPath: option.publicPath,
    },
    client: {
      logging: 'warn',
      overlay: {
        errors: true,
        warnings: false
      },
    },
    webSocketServer: "ws",
    hot: true,
    compress: true,
    open: true,
    setupExitSignals: true, // CTRL+C 退出时 close 掉 server ,但是目前不好使
    allowedHosts: "all",
    port: option.customPort,
    host: option.customHost,
    https: option.customProtocol === 'https',
    proxy: option.customProxy,
  };
};
