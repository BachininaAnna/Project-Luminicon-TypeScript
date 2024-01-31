const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: './src/app.ts',
    devtool: 'inline-source-map',
    mode: 'development',
    module: {
        rules: [
            { test: /\.svg$/, use: 'svg-inline-loader' },
            { test: /\.css$/, use: [ 'style-loader', 'css-loader' ] },
            {test: /\.tsx?$/, use: 'ts-loader', exclude: /node_modules/},
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: '.dist',
        compress: true,
        port: 9000,
    },
    output: {
        filename: 'src/app.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./index.html",
        }),
        new CopyPlugin({
            patterns: [
                {from: "templates", to: "templates"},
                {from: "styles", to: "styles"},
                {from: "static/images", to: "static/images"},
                {from: "node_modules/bootstrap/dist/js/bootstrap.js", to: "node_modules/bootstrap/dist/js/bootstrap.js"},
                {from: "node_modules/bootstrap/dist/css/bootstrap.css", to: "node_modules/bootstrap/dist/css/bootstrap.css"},
                {from: "node_modules/chart.js/dist/chart.umd.js", to: "node_modules/chart.js/dist/chart.umd.js"},
            ],
        }),
    ]
}