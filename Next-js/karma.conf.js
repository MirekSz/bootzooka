var webpack = require("webpack");
module.exports = function (config) {
    config.set({
        proxies: {
            '/next-www-blc/': 'http://strumyk-next-build:80/next-www-blc/'
        },
        files: [
            // all files ending in "test"
            './node_modules/jquery/dist/jquery.js',
            './sources/aui-min.js',
            './sources/bootstrap-3.3.4-dist/js/bootstrap.js',
            './node_modules/phantomjs-polyfill/bind-polyfill.js',
            'node_modules/babel-polyfill/dist/polyfill.js',
            './app/globals.es6',
            './app/tests/UnitTestExecutor.es6',
            './app/tests/FrontEndTestExecutor.es6'
        ],

        frameworks: ['mocha', 'chai', 'sinon'],

        preprocessors: {
            './app/**/*.es6': ['webpack', 'sourcemap']
        },

        reporters: ['spec', 'junit', 'coverage'],

        junitReporter: {
            outputFile: 'test-results.xml'
        },
        singleRun: true,
        restartOnFileChange: false,
        watch: false,
        coverageReporter: {
            type: 'cobertura',
            dir: 'coverage/'
        },
        webpack: {
            devtool: 'eval',
            module: {
                preLoaders: [
                    {
                        test: /\.es6?$/,
                        exclude: [
                            /node_modules/,
                            /app\/src\/tests/,
                            /\.spec\.js/
                        ],
                        query: {compact: false},
                        loader: 'isparta-instrumenter-loader'
                    }
                ],
                loaders: [{
                    test: /\.json?$/,
                    loaders: ['json'],
                    exclude: /node_modules/
                },
                    {test: /\.css$/, loader: "style!css"},
                    {
                        test: /\.es6$/, loader: "babel", query: {
                        presets: ['es2015'],
                        compact: false
                    },
                        exclude: /node_modules/
                    },
                    {
                        test: /\.js$/, loader: "babel", query: {
                        presets: ['es2015'],
                        compact: false
                    },
                        exclude: /node_modules/
                    },
                    {test: /\.less$/, loader: "style!css!less"},
                    {
                        test: /\.hbs/,
                        loader: "handlebars-loader?helperDirs[]=" + __dirname + "/hbhelpers"
                    }
                ]
            },
            resolve: {
                extensions: ['', '.js', '.es6'],
                modulesDirectories: [
                    "",
                    "app",
                    "node_modules"
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    ENV: JSON.stringify("TEST")
                })
            ]
        },

        webpackMiddleware: {
            noInfo: true
        },

        plugins: [
            require("karma-webpack"),
            require("karma-sourcemap-loader"),
            require("istanbul-instrumenter-loader"),
            require("karma-mocha"),
            require("karma-chai"),
            require("karma-sinon"),
            require("karma-coverage"),
            require("karma-phantomjs-launcher"),
            require("karma-chrome-launcher"),
            require("karma-spec-reporter"),
            require("karma-junit-reporter")

        ],

        browsers: ['PhantomJS_Desktop'],
        customLaunchers: {
            'PhantomJS_Desktop': {
                base: 'PhantomJS',
                options: {
                    viewportSize: {
                        width: 1228,
                        height: 1000
                    }
                }
            }
        }
    });
};
