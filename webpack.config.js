
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const path = require("path");

module.exports = {
    entry: './src/app.js',
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: 'app.bundle.js'
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['es2015']
                    },
                }],
            },
            {
                test: /\.scss$/,
                use: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: ['css-loader', 'sass-loader'],
                    publicPath: '/dist'
                })
            }
        ]
    },
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        compress: true,
        stats: "errors-only",
        open: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: 'JSZIP Project',
            minify: {
               collapseWhitespace: true
            },
            hash: true,
            template: './src/index.html', // Load a custom template (ejs by default)
        }),
        new ExtractTextPlugin({
            filename: 'app.css',
            disable: false,
            allChunks: true
        })
    ]
}