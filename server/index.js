'use strict';

const path = require('path');
const Koa = require('koa');
const mockProxy = require('./app/middleware/mockProxy');
const { Logger, Global, fsHandler } = require('./app/lib/index');
const bodyParser = require('koa-bodyparser');

const time = Date.now();
const PORT = 3001;

const app = new Koa();

app.use(bodyParser());
// 配置mock
app.use(
  mockProxy({
    prefix: '/__DEV__',
  })
);

// init global data
Global.rootPath = path.resolve(__dirname, './data/mock');
Global.proxyPath = path.resolve(__dirname, './data/proxy/config.json');
Global.currentProxyUrl = fsHandler.getProxyConfig(Global.proxyPath)[0];
const dirs = fsHandler.findDirs(Global.rootPath);
Global.mockList = dirs.map(it => {
  return { api: it, open: false };
});
// routers
const router = require('./app/router');
app.use(router.routes(), router.allowedMethods());

Logger.info(` app star in ${(Date.now() - time) / 1000} s, listen on port ${PORT}`);

app.listen(PORT);