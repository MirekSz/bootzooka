var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.join(__dirname, '..', 'app');
var TESTS_DIR = path.join(__dirname, '..', 'tests');

var commonsPlugin =
    new webpack.optimize.CommonsChunkPlugin('common.js');

var config = {
    debug: true,
    devtool: 'cheap-module-source-map',
    entry: {
        app: ['./app/globals.es6', './app/index.es6', 'webpack-hot-middleware/client?reload=true'],
        tests: ['babel-polyfill', './app/globals.es6', './app/tests/TestExecutor.es6', 'webpack-hot-middleware/client?reload=true']
    },
    module: {
        loaders: [{
            test: /\.json?$/,
            loaders: ['json'],
            include: [APP_DIR, TESTS_DIR],
            exclude: /node_modules/
        }, {
            test: /\.es6?$/,
            loaders: ['babel?cacheDirectory'],
            include: [APP_DIR, TESTS_DIR],
            exclude: /node_modules/
        }, {
            test: /\.less$/,
            loader: "style!raw!less",
            exclude: /node_modules/
        }, {
            test: /\.hbs/,
            loader: "handlebars-loader?helperDirs[]=" + __dirname + "/../hbhelpers",
            include: [APP_DIR, TESTS_DIR],
            exclude: /node_modules/
        }],
        noParse: ['superagent', 'chai', 'lodash']
    },
    output: {
        filename: '[name].js',
        path: path.join(__dirname, '..', 'build'),
        publicPath: '/static/'
    },
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.CommonsChunkPlugin('common.js'),
        new webpack.DefinePlugin({
            ENV: JSON.stringify("DEV")
        })
    ],
    resolve: {
        root: [path.resolve('../app')],
        extensions: ['', '.jsx', '.js', '.es6'],
        alias: {}
    },
    node: {
        fs: "empty" // avoids error messages
    }
};

var minified_libs = path.join(__dirname, '..', 'lib');
var deps = [
//    'lodash/lodash.min.js'
];
deps.forEach(function (dep) {
    var depPath = path.resolve(minified_libs, dep);
    config.resolve.alias[dep.split('/')[0]] = depPath;
    config.module.noParse.push(depPath);
});
module.exports = config;
