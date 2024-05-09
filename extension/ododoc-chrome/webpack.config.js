const path = require('path');
const Dotenv = require('dotenv-webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: {
    popup: './src/index.tsx',  // 팝업 페이지에 대한 엔트리 포인트 추가
    background: './src/background.ts',
    contentScript: './src/contentScript.ts'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        use: {
          loader: 'babel-loader',  // Babel 로더 사용
          options: {
            presets: ['@babel/preset-env', '@babel/preset-react', '@babel/preset-typescript']
          }
        },
        exclude: /node_modules/
      },
      {
        test: /\.css$/, // .css 확장자로 끝나는 모든 파일
        exclude: /\.module\.css$/,
        use: ['style-loader', 'css-loader'], 
      },
      {
        test: /\.module\.css$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                mode: 'local',
                localIdentName: '[name]__[local]___[hash:base64:5]'
              },
              importLoaders: 1
            }
          }
        ],
        include: path.resolve(__dirname, 'src/css/login')
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        type: 'asset/resource'
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html',
      filename: 'index.html',
      chunks: ['popup']
    }),
    new CopyPlugin({
      patterns: [
        { from: 'public/manifest.json', to: 'manifest.json' },
        { from: 'src/images', to: 'images' }
      ]
    }),
    new Dotenv()
  ],
  resolve: {
    extensions: ['.tsx', '.ts', '.js']
  },
  devtool: 'source-map'
};
