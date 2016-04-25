var path = require('path');
var webpack = require('webpack');

var APP_DIR = path.join(__dirname, '..', 'app');

module.exports = {
    devtool: 'source-map',
    entry: './app/index.es6',
    module: {
        loaders: [{
            test: /\.es6?$/,
            loaders: ['babel'],
            include: [APP_DIR]

        }, {
            test: /\.less$/,
            loader: "style!raw!less"
        }, {
            test: /\.hbs/,
            loader: "handlebars-loader",
            include: [APP_DIR]
        }]
    },
    output: {
        path: path.join(__dirname, '..', 'build'),
        filename: 'app.js',
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            },
            ENV: JSON.stringify("PROD")
        }),
        new webpack.optimize.UglifyJsPlugin({
            compressor: {
                warnings: false
            }
        })
    ],
    resolve: {
        root: [path.resolve('./app')],
        extensions: ['', '.jsx', '.js', '.es6'],
        alias: {}
    }
};