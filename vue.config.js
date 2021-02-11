const path = require("path");
const resolve = (dir) => path.join(__dirname, dir);

module.exports = {
  pluginOptions: {
    // 共享全局less样式
    "style-resources-loader": {
      preProcessor: "less",
      patterns: [resolve("src/styles/variables.less")],
    },
  },
  devServer: {
    proxy: {
      "/boss": {
        target: "http://eduboss.lagou.com",
        changeOrigin: true, // 把请求头中的 host 配置为 target
      },
      "/front": {
        target: "http://edufront.lagou.com",
        changeOrigin: true,
      },
    },
  },
};
