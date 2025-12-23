module.exports = function (context, options) {
  return {
    name: 'custom-webpack-config',
    configureWebpack(config, isServer) {
      if (!isServer) {
        return {
          resolve: {
            alias: {
              react: require.resolve('react'),
              'react-dom': require.resolve('react-dom'),
            },
          },
        };
      }
      return {};
    },
  };
};
