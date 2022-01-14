module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dist',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.1.21:9091/dsc',
        changeOrigin: true,
        pathRewrite: {
          '/api': '',
        },
      },
    },
    port: 9091,
  },
}
