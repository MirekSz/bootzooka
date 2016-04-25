var path = require('path');
var express = require('express');
var webpack = require('webpack');
var config = require('./config/webpack.dev');

var app = express();
var compiler = webpack(config);
var port = process.env.PORT || 5001;

var httpProxy = require('http-proxy');
var Agent = require('agentkeepalive');

var agent = new Agent({
    maxSockets: Number.MAX_VALUE,
    keepAlive: true,
    maxFreeSockets: 1000,
    keepAliveMsecs: 1000,
    timeout: 60000,
    keepAliveTimeout: 30000 // free socket keepalive for 30 seconds
});
var proxy = httpProxy.createProxyServer({agent: agent});

process.on('uncaughtException', function (exception) {
    //ignore crash process
})
function apiProxy(host, port) {

    return function (req, res, next) {
        if (req.url.match(new RegExp('^\/next-www-blc\/'))) {
            proxy.web(req, res, {target: 'http://strumyk-next-build/'});
            setTimeout(function () {
                res.end();
            }, 10000);
        } else {
            next();
        }
    }
}
app.use(apiProxy('localhost', port));

app.use(require('webpack-dev-middleware')(compiler, {
    noInfo: true,
    quiet: false,
    reload: true,
    stats: {colors: true},
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'app/index.html'));
});
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, req.originalUrl.split('?')[0]));
});


app.listen(port, 'localhost', err => {
    if (err) {
        console.log(err);
        return;
    }

    console.log(`Listening at http://localhost:${port}`);
});
