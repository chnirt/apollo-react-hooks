const { override, fixBabelImports, addLessLoader } = require('customize-cra')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
	.BundleAnalyzerPlugin

const addPlugins = () => config => {
	config.plugins.push(
		new ProgressBarPlugin({
			format:
				chalk.blue('build ') +
				chalk.hex('#2f54eb')('▯:bar▯ ') +
				// chalk.red('▯ :bar ▯ ') +
				chalk.hex('#52c41a')(':percent ') +
				// chalk.green(':percent ') +
				chalk.hex('#ffec3d')(':elapseds'),
			// chalk.blue('( :elapsed s )')
			complete: '▰',
			incomplete: '▱'
		})
		// new BundleAnalyzerPlugin({
		// 	analyzerMode: 'disabled', // server, static, disabled
		// 	analyzerHost: 'localhost',
		// 	analyzerPort: 3001, // 8888
		// 	openAnalyzer: false, // true
		// 	// statsFilename: 'stats.json', // stats.json
		// 	// statsOptions: null, // null or {Object}
		// 	// generateStatsFile: true,
		// 	logLevel: 'info' // info, warn, error, silent
		// })
	)
	return config
}

module.exports = override(
	fixBabelImports('import', {
		libraryName: 'antd',
		libraryDirectory: 'es',
		style: true
	}),
	addLessLoader({
		javascriptEnabled: true,
		modifyVars: { '@primary-color': '#ff4d4f' }
	}),
	addPlugins()
)
