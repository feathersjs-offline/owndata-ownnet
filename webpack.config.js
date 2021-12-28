const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

function createConfig (name, isProduction = false) {
  const output = name === 'index' ? 'feathersjs-offline' : 'feathersjs-offline-' + name;
  const entry = 'index';
  const commons = {
    entry: `./packages/${name}/lib/${entry}.js`,
    // resolve: { // webpack ^5.0.0 syntax
    //   fallback: { 
    //     "util": false,
    //     "fs": false,
    //     "assert": false,
    //     "stream": false,
    //     "constants": false,
    //     "path": false
    //   }
    // },
    node: { 
      "util": 'empty',
      "fs": 'empty',
      "assert": 'empty',
      "stream": 'empty',
      "constants": 'empty',
      "path": 'empty'
    },
    output: {
      library: `feathersjsOffline${name.substr(0,1).toUpperCase()}${name.substr(1)}`,
      libraryTarget: 'var', // 'umd',
      globalObject: 'this',
      path: path.resolve(__dirname, 'packages', `${name}`, 'dist'),
      filename: `${output}.js`
    },
    module: {
      rules: [{
        test: /\.js/,
        exclude: /node_modules\/(?!(@feathersjs|debug))/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }]
    }
  };

  const dev = {
    mode: 'development',
    devtool: 'source-map',
    output: {
      filename: `${output}.js`
    },
  };

  const production = {
    mode: 'production',
    output: {
      filename: `${output}.min.js`
    },
    optimization: {
      minimize: true,
      }
  };

  return merge(commons, isProduction ? production : dev);
}

module.exports = [
  createConfig('client'),
  createConfig('client', true),
  createConfig('server'),
  createConfig('server', true),
];
