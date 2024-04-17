const webpack = require("webpack");
const path = require("path");
const TransformModulesPlugin = require("webpack-transform-modules-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const SpeedMeasurePlugin = require("speed-measure-webpack-plugin");
const PreloadWebpackPlugin = require("@vue/preload-webpack-plugin");
const smp = new SpeedMeasurePlugin();

const isProduction = process.env.NODE_ENV === "production";

const configWebPack = {
  publicPath: process.env.NODE_ENV === "production" ? "/admin" : "/",
  chainWebpack: config => {
    config.plugins.delete("prefetch");
    config.plugins.delete("pwa");
    config.plugins.delete("workbox");
  },
  css: {
    loaderOptions: {
      less: {
        javascriptEnabled: true
      }
    }
  },
  configureWebpack: smp.wrap({
    resolve: {
      extensions: ["*", "ts", "tsx", ".js", ".vue", "less", ".json"],
      alias: {
        "@styles": path.resolve(__dirname, "src/assets/css")
      }
    },
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: "less-loader",
              options: {
                modifyVars: {
                  "text-color": "#e1e7ef",
                  "text-color-secondary": "#728bb9",
                  "heading-color": "#728bb9",
                  "primary-color": "#0095ff",
                  "link-color": "#0095ff",
                  "border-radius-base": "0px",
                  "disabled-bg": "#576586",
                  "disabled-color": "#576586",
                  "border-color-split": "#314363",
                  "tabs-card-head-background": "#1a243b",
                  "component-background": "#1a243b",
                  "checkbox-check-color": "#1d3863",
                  "border-color-base": "#295e9f",
                  "item-active-bg": "#0e182b",
                  "green-base": "#16c393",
                  "red-base": "#ea4d4d",
                  "blue-base": "#0095ff",
                  "orange-base": "#dea959",
                  "success-color": "#12b886",
                  "error-color": "#fa5252"
                },
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    },
    plugins: [
      new webpack.ProvidePlugin({}),
      new TransformModulesPlugin(),
      new PreloadWebpackPlugin()
    ]
  }),
  productionSourceMap: false,
  devServer: {
    proxy: {
      //Mocks Server
      /*"^/api/v2/auth": {
        target: "http://localhost:9002",
        secure: false,
        ws: false,
        changeOrigin: true
      },
      "^/api/v2/trade": {
        target: "http://localhost:9002",
        secure: false,
        ws: false,
        changeOrigin: true
      },
      "/api/v2/websocket": {
        target: "ws://localhost:9003",
        secure: false,
        ws: true,
        changeOrigin: true
      }*/
      //Test Server
      "^/api": {
        target: "https://www.fortem1.com.br",
        secure: true,
        ws: true,
        changeOrigin: true
      }
    },
    host: "0.0.0.0",
    port: 3000,
    hot: true,
    disableHostCheck: true
  }
};

if (isProduction) {
  configWebPack.configureWebpack.plugins.push(
    new webpack.optimize.ModuleConcatenationPlugin(),
    new CompressionPlugin(),
    new HardSourceWebpackPlugin({
      cachePrune: {
        // Caches younger than `maxAge` are not considered for deletion. They must
        // be at least this (default: 2 days) old in milliseconds.
        maxAge: 2 * 24 * 60 * 60 * 1000,
        // All caches together must be larger than `sizeThreshold` before any
        // caches will be deleted. Together they must be at least this
        // (default: 50 MB) big in bytes.
        sizeThreshold: 1024 * 1024 * 1024
      }
    }),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
  );
}

module.exports = configWebPack;
