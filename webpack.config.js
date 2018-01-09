const webpack = require('webpack');
const path = require('path');
const loaders = require('./webpack.loaders');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const ExtractTextPlugin = require('extract-text-webpack-plugin');

const HOST = process.env.HOST || '127.0.0.1';
const PORT = process.env.PORT || '8888';

loaders.push(
  {
    // global css
    test: /\.css$/,
    exclude: /[/\\]src[/\\]/,
    // include: /[\/\\](globalStyles)[\/\\]/,
    loaders: ['style-loader?sourceMap', 'css-loader']
  },
  // // global scss
  // {
  //   test: /\variables.scss$/,
  //   exclude: /[/\\]components[/\\]/,
  //   // include: /[/\\](styles/variables.scss)[/\\]/,
  //   loaders: ['sass-variable-loader']
  // },
  // global scss
  {
    test: /\.scss$/,
    exclude: /[/\\]components[/\\]/,
    use: [
      {
        loader: 'style-loader'
      },
      {
        loader: 'css-loader'
      },
      {
        loader: 'sass-loader',
        options: {
          includePaths: [path.resolve(__dirname, 'node_modules')]
        }
      }
    ]
  },
  // local scss modules
  {
    test: /\.scss$/,
    include: /[/\\](components)[/\\]/,
    exclude: /[/\\](global)[/\\]/,
    loaders: [
      'style-loader?sourceMap',
      'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
      'postcss-loader',
      'sass-loader'
    ]
  },
  // TODO: production
  // {
  //   test: /\.scss$/,
  //   include: /[/\\](components)[/\\]/,
  //   exclude: /[/\\](global)[/\\]/,
  //   loaders: [
  //     'style-loader?sourceMap',
  //     'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
  //     'postcss-loader',
  //     'sass-loader'
  //   ]
  // },
  // local scss modules
  // {
  //   test: /\.css$/,
  //   include: /[/\\](components)[/\\]/,
  //   loaders: [
  //     'style-loader?sourceMap',
  //     'css-loader?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]',
  //     'postcss-loader'
  //   ]
  // },
  {
    test: /bootstrap\/dist\/js\/umd\//,
    loader: 'imports-loader?jQuery=jquery'
  },
  {
    test: /mapbox-gl.+\.js$/,
    loader: 'transform-loader/cacheable?brfs'
  }
);

// local css modules
// loaders.push({
//   test: /\.css$/,
//   exclude: /[\/\\](node_modules|bower_components|public)[\/\\]/,
//   loaders: [
//     'style?sourceMap',
//     'css?modules&importLoaders=1&localIdentName=[path]___[name]__[local]___[hash:base64:5]'
//   ]
// });

module.exports = {
  entry: [
    'react-hot-loader/patch',

    `webpack-dev-server/client?http://${HOST}:${PORT}`,
    // bundle the client for webpack-dev-server
    // and connect to the provided endpoint

    'webpack/hot/only-dev-server',
    // bundle the client for hot reloading
    // only- means to only hot reload for successful updates
    './src/index.jsx' // your app's entry point
  ],
  // TODO:change for production
  devtool: 'cheap-module-eval-source-map',
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.js', '.jsx'],
    alias: {
      // 'mapbox-gl$': path.resolve('./node_modules/mapbox-gl/dist/mapbox-gl.js')
      src$: './src',
      DummyData: path.resolve(__dirname, './src/DummyData.js')
    }
  },
  module: {
    loaders
  },
  devServer: {
    contentBase: './public',
    noInfo: true,
    // hot: true,
    inline: true,
    historyApiFallback: true,
    port: PORT,
    host: HOST,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
      'Access-Control-Allow-Headers':
        'X-Requested-With, content-type, Authorization'
    }
    // proxy: {
    //   '**': {
    //     target: 'http://localhost:8000/',
    //     secure: false
    //   }
    // }
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './src/template.html'
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      Popper: ['popper.js', 'default'],
      // In case you imported plugins individually, you must also require them here:
      Util: 'exports-loader?Util!bootstrap/js/dist/util',
      Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown'
    }),
    new webpack.EnvironmentPlugin({
      MapboxAccessToken:
        'pk.eyJ1Ijoiam1hdXNoYWciLCJhIjoiY2o4dHlmZTBkMGowbTJ3cDI3a3J3cHhoZSJ9.W-cFyxdadt5EXzRXKuXKrQ'
    })
    // new webpack.optimize.ModuleConcatenationPlugin(),
    // new ExtractTextPlugin('style.css')
    // new webpack.ProvidePlugin({
    // $: 'jquery',
    // jQuery: 'jquery',
    // 'window.jQuery': 'jquery',
    // Tether: 'tether',
    // 'window.Tether': 'tether'
    // Tooltip: 'exports-loader?Tooltip!bootstrap/js/dist/tooltip',
    // Alert: 'exports-loader?Alert!bootstrap/js/dist/alert',
    // Button: 'exports-loader?Button!bootstrap/js/dist/button',
    // Carousel: 'exports-loader?Carousel!bootstrap/js/dist/carousel',
    // Collapse: 'exports-loader?Collapse!bootstrap/js/dist/collapse',
    // Dropdown: 'exports-loader?Dropdown!bootstrap/js/dist/dropdown',
    // Modal: 'exports-loader?Modal!bootstrap/js/dist/modal',
    // Popover: 'exports-loader?Popover!bootstrap/js/dist/popover',
    // Scrollspy: 'exports-loader?Scrollspy!bootstrap/js/dist/scrollspy',
    // Tab: 'exports-loader?Tab!bootstrap/js/dist/tab',
    // Util: 'exports-loader?Util!bootstrap/js/dist/util'
    // })
  ]
};
