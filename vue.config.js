// const path = require('path')

// function resolve(dir) {
//     return path.join(__dirname, dir)
// }

module.exports = {
  publicPath: "/",
  outputDir: "dist",
  assetsDir: "static",
  productionSourceMap: false,
  // chainWebpack: config => {
  //     config.resolve.alias
  //         .set("@", resolve("src"))
  //         .set("assets", resolve("src/assets"))
  //         .set("components", resolve("src/components"))
  //         .set("base", resolve("baseConfig"))
  //         .set("public", resolve("public"));
  // },
  // devServer: {
  //   proxy: {
  //     '/audit': {
  //       target: 'http://192.168.1.21:9091/',
  //       changeOrigin: true,
  //       pathRequiresRewrite: {
  //         '^/audit': ''
  //       }
  //     }
  //   },
  //   port: 9091
  // },
};
