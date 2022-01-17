const path = require('path');
module.exports = {
  mode: 'production',
  devtool: 'eval-source-map',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'ts-loader',
        },
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
  },
  output: {
    publicPath: 'public',
    filename: 'script.js',
    path: path.resolve(__dirname, 'public'),
  },
};
