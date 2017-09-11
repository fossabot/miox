const { alias } =  require('./util');
const path = require('path');
const webpack = require('webpack');
const ServerSideRenderConfigs = require('./webpack.ssr.config');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const proxy = require('./webpack.proxy');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const dir = path.dirname(ServerSideRenderConfigs.app);
const loaders = require('./webpack.loaders');

module.exports = {
    /**
     * 入口文件
     * vendor：公共文件，抽出来可缓存时间较长
     * app: 业务文件，频繁改动
     */
    entry: {
        'app': ServerSideRenderConfigs.app
    },

    devtool: "#inline-source-map",

    resolve: { alias },

    /**
     * 打包产物输出目录
     */
    output: {
        path: ServerSideRenderConfigs.build,
        filename: '[name].[hash:10].js'
    },

    module: {
        rules: loaders
    },

    plugins: [
        new HtmlWebpackPlugin({
            template: `${dir}/index.html`,
            filename: 'index.html',
            inject: true
        }),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
            'process.env.MIOX_ENV': '"web"'
        }),
        new ExtractTextPlugin('style.[hash:10].css')
    ],

    devServer: {
        contentBase: dir,
        proxy: proxy,
        host: ServerSideRenderConfigs.ip,
        port: ServerSideRenderConfigs.port,
        disableHostCheck: true
    }
}