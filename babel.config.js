module.exports = function (api) {
  api.cache(true);

  const presets = [
    [
      '@babel/preset-env',
      {
        modules: false,
        bugfixes: true,
        useBuiltIns: false,
      },
    ],
    [
      '@babel/preset-react',
      {
        runtime: 'classic',
      },
    ],
    ['@babel/preset-typescript', {allowDeclareFields: true}],
  ];
  const plugins = [
    ['@babel/plugin-proposal-decorators', { legacy: true }],
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-function-sent',
    ['@babel/plugin-transform-runtime', { corejs: false, helpers: true, regenerator: true }],
    ['import', { libraryName: 'antd', libraryDirectory: 'es', style: true }, 'antd'],
  ];

  const assumptions = {
    "constantSuper": true,
    "noClassCalls": true,
    "setClassMethods": true,
    "superIsCallableConstructor": true,
    "setPublicClassFields": false,
  };

return {
  presets,
  plugins,
  assumptions,
  sourceType: "unambiguous",
  ignore: [/[\/\\]core-js/, /@babel[\/\\]runtime/]
};
};
