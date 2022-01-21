module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : '/',
  outputDir: 'dsc',
  assetsDir: 'static',
  productionSourceMap: false,
  devServer: {
    proxy: {
      '/dsc': {
        target: 'http://192.168.1.21:9091/',
        changeOrigin: true,
        pathRequiresRewrite: {
          '^/dsc': '',
        },
      },
    },
    port: 9091,
  },
}
