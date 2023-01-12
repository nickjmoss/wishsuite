const { mergeWithRules } = require('webpack-merge');
const common = require('./webpack.common.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

console.log('\n\nWebpack is building. . .\n\n');

module.exports = mergeWithRules({
	module: {
		rules: {
			use: {
				options: 'merge',
			},
		},
	},
})(common, {
	stats: {
		colors: true
	},
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		hot: true,
		port: '9090',
		proxy: {
			'/': {
				target: 'http://localhost:4000',
				secure: false,
				changeOrigin: true,
			},
		},
	},
	plugins: [
		new ReactRefreshWebpackPlugin(),
	],
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				use: {
					options: {
						plugins: [
							require.resolve('react-refresh/babel'),
						],
					},
				},
			},
		],
	},
});