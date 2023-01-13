const { mergeWithCustomize } = require('webpack-merge');
const common = require('./webpack.common.js');
const TerserPlugin = require('terser-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = mergeWithCustomize({
	customizeObject(commonModule, prodModule, key) {
		// custom edit the 'module' property
		if (key === 'module') {
			// edit the scss rule to change css classes to a hash (recommended for production)
			commonModule.rules[2].use[1].options.modules.localIdentName = '[hash:base64]';
			return commonModule;
		}

		// Fall back to default merging
		return undefined;
	}
})(common, {
	mode: 'production',
	optimization: {
		minimize: true,
		minimizer: [new TerserPlugin()]
	},
	module: {},
	plugins: [
		new UglifyJsPlugin(), //minify everything
		new CompressionPlugin()
	],
	devServer: {
		allowedHosts: [
			'.amazonaws.com'
		]
	}
});