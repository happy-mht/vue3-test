'use strict'
const path = require('path')

const port = process.env.port || process.env.npm_config_port || 8890 // dev port

// All configuration item explanations can be find in https://cli.vuejs.org/config/
module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  assetsDir: 'static',
  lintOnSave: process.env.NODE_ENV === 'development',
  productionSourceMap: false,
  devServer: {
    port: port,
    proxy: {
      [process.env.VUE_APP_BASE_API]: {
        // target: `http://172.20.13.54:8080`,
        target: `https://ee-test.leqee.com`,
        changeOrigin: true,
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },

  chainWebpack(config) {
    // 可引入scss全局变量
    const oneOfsMap = config.module.rule('scss').oneOfs.store
    oneOfsMap.forEach(item => {
      item
        .use('sass-resources-loader')
        .loader('sass-resources-loader')
        .options({
          resources: path.resolve(__dirname,'./src/assets/global.scss')
        })
        .end()
    })
  }
}
