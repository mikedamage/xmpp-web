const webpack               = require('webpack');
const path                  = require('path');
const buildPath             = path.resolve(__dirname, 'build');
const nodeModulesPath       = path.resolve(__dirname, 'node_modules');
const TransferWebpackPlugin = require('transfer-webpack-plugin');
const ExtractTextPlugin     = require('extract-text-webpack-plugin');
const AppCachePlugin        = require('appcache-webpack-plugin');

const config = {
  entry: [
    path.join(__dirname, '/src/app/app.jsx'),
    path.join(__dirname, '/src/app/app.scss')
  ],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ["", ".js", ".jsx"]
    //node_modules: ["web_modules", "node_modules"]  (Default Settings)
  },
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js'  //Name of output file
  },
  plugins: [
    //Minify the bundle
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        //supresses warnings, usually from module minification
        warnings: false
      }
    }),
    //Allows error warnings but does not stop compiling. Will remove when eslint is added
    new webpack.NoErrorsPlugin(),
    //Transfer Files
    new TransferWebpackPlugin([
      {from: 'www'}
    ], path.resolve(__dirname,"src")),

    new ExtractTextPlugin('style.css', {
      allChunks: true
    }),

    new AppCachePlugin({
      cache: ['https://fonts.googleapis.com/css?family=Roboto:400,300,500', 'https://fonts.googleapis.com/icon?family=Material+Icons']
    }),

    new webpack.DefinePlugin({
      process: {
        env: {
          NODE_ENV: JSON.stringify(process.env.NODE_ENV),
          BOSH_URL: JSON.stringify(process.env.BOSH_URL),
        },
      },
    }),
  ],
  module: {
    preLoaders: [
      {
        test: /\.(js|jsx)$/,
        loader: 'eslint-loader',
        include: [path.resolve(__dirname, "src/app")],
        exclude: [nodeModulesPath, path.resolve(__dirname, "src/app/vendor")]
      },
    ],
    loaders: [
      {
        test: /\.(js|jsx)$/, //All .js and .jsx files
        loader: 'babel-loader?stage=0', //react-hot is like browser sync and babel loads jsx and es6-7
        exclude: [nodeModulesPath, path.resolve(__dirname, "src/app/vendor")]
      },

      {
        test: /\.scss$/,
        loader: ExtractTextPlugin.extract("css!sass")
      },

      {
        test: /\.jpe?g$|\.gif$|\.png$|\.svg$|\.woff$|\.ttf|\.ico$/,
        loader: "file"
      },
    ]
  },
  //Eslint config
  eslint: {
    configFile: '.eslintrc' //Rules for eslint
  },
};

module.exports = config;
