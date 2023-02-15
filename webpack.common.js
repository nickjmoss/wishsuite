const path = require('path');

module.exports = {
	context: path.join(__dirname),
	entry: './frontend/js/app.js',
	module: {
		rules: [
			{
				test: /\.less$/,
				use: [{
					loader: 'style-loader',
				}, {
					loader: 'css-loader',
				}, {
					loader: 'less-loader',
					options: {
						lessOptions: {
							javascriptEnabled: true,
						},
					},
				}],
			},
			{
				test: /\.jsx?$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
				},
			},
			{
				test: /\.s?css$/,
				use: [
					{
						loader: 'style-loader',
					},
					{
						loader: 'css-loader',
						options: {
							modules: {
								localIdentName: '[name]__[local]',
							},
							sourceMap: true,
						},
					},
					{
						loader: 'resolve-url-loader',
					},
					{
						loader: 'sass-loader',
						options: {
							sourceMap: true,
						},
					},
				],
				exclude: /(node_modules)/,
				include: path.join(__dirname, '/'),
			},
			{
				test: /\.(woff|woff2|eot|ttf)$/i,
				use: ['file-loader?name=fonts/[name]-[hash].[ext]'],
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: ['file-loader?name=images/[name]-[hash].[ext]'],
			},
		],
	},
	output: {
		path: path.join(__dirname, '/public'),
		filename: './js/bundle.js',
		publicPath: '/',
	},
	resolve: {
		alias: {
			'@app': path.resolve(__dirname, './frontend'),
			'@request': path.resolve(__dirname, './frontend/js/api/'),
			'@stores': path.resolve(__dirname, './frontend/js/stores/'),
			'@reusableComponents': path.resolve(__dirname, './frontend/js/components/reusableComponents'),
			'@config': path.resolve(__dirname, './frontend/config'),
			'@utils': path.resolve(__dirname, './frontend/js/utils'),
			'@colors': path.resolve(__dirname, './frontend/styles/colors.scss'),
			'@components': path.resolve(__dirname, './frontend/js/components'),
		},
	},
};
