const webpack = require("webpack");

module.exports = {
  style: {
    postcss: {
      plugins: [require("tailwindcss"), require("autoprefixer")],
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.plugins.push(
        new webpack.ProvidePlugin({
          process: "process/browser",
        })
      );
      return webpackConfig;
    },
  },
};
