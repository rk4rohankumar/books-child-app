const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');

module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.output.publicPath = 'https://books-child-app.vercel.app/';

      webpackConfig.plugins.push(
        new ModuleFederationPlugin({
          name: 'BooksApp',
          filename: 'remoteEntry.js',
          exposes: {
            './BooksApp': './src/App',
          },
          shared: {
            react: { eager: true },
            'react-dom': { eager: true },
            'tailwindcss': { eager: true }
          },
        })
      );
      return webpackConfig;
    },
  },
};
