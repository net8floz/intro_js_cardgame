module.exports = {
  lintOnSave: false,
  devServer: {
    proxy: {
      '^/socket.io': {
        target: 'http://localhost:6969/socket.io',
        ws: true,
        changeOrigin: true
      }
    }
  }
};
