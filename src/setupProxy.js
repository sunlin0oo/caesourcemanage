const { createProxyMiddleware } = require('http-proxy-middleware')
// 反向代理
module.exports = function (app) {
  app.use(createProxyMiddleware('/ajax', {
    target: 'https://i.maoyan.com',
    changeOrigin: true,
  }))
}
