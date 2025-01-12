const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://viacep.com.br',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '/ws', // Reescreve a URL para corresponder ao endpoint do ViaCEP
      },
    })
  );
};