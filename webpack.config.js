const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = (env) => {
  const htmlTemplate = './src/index.html';
  const plugins = [new HtmlWebpackPlugin({ template: htmlTemplate })];

  const mode = env && env.prod ? 'production' : 'development';

  return {
    devtool: 'inline-source-map',
    entry: {
      app: './src/Editor.js',
    },
    mode,
    output: {
      filename: '[name].[contenthash].js',
      path: path.resolve(__dirname, 'dist'), // Ensure the output path is set
      clean: true,
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/, // Handle both .js and .jsx files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react'], // Add presets for modern JS and React
            },
          },
        },
        {
          test: /\.css$/, // CSS handling
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    resolve: {
      extensions: ['.js', '.jsx'], // Enable importing JS and JSX files without specifying extensions
    },
    devServer: {
      open: true,
      static: './dist',
      hot: true, // Enable hot reloading for development
    },
    plugins,
  };
};
