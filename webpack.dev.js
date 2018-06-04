const merge = require('webpack-merge');
const common = require('./webpack.config.js');

module.exports = merge(common, {
	devtool: 'inline-source-map',
	devServer: {
		contentBase: './dist',
		historyApiFallback: true,
		// host: '0.0.0.0',
		// host:'192.168.31.233',
		// noInfo: true,
		open: true,
		port:9001,
		proxy:{
			"/api": {
		    // target: "http://cartmall.net",
				target: "http://192.168.2.223",
		    pathRewrite: {"^/api" : ""},
				secure: false
		  }
		}
	}
});
