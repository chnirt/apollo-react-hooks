const {
	override,
	addDecoratorsLegacy,
	disableEsLint,
	// addBabelPlugins,
	// addBabelPresets,
	addBundleVisualizer,
	// addWebpackAlias,
	adjustWorkbox,
	fixBabelImports,
	addLessLoader
} = require('customize-cra')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
// 	.BundleAnalyzerPlugin

const addPlugins = () => (config, env) => {
	config.plugins.push(
		new ProgressBarPlugin({
			format:
				chalk.hex('#6c5ce7')('build ') +
				chalk.hex('#0984e3')('▯:bar▯ ') +
				// chalk.red('▯ :bar ▯ ') +
				chalk.hex('#00b894')('(:percent) ') +
				// chalk.green(':percent ') +
				chalk.hex('#ffeaa7')(':msg'),
			// chalk.blue('( :elapsed s )')
			complete: '▰',
			incomplete: '▱',
			clear: false
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
	addDecoratorsLegacy(),
	disableEsLint(),
	// ...addBabelPlugins(
	// 	'polished',
	// 	'emotion',
	// 	'babel-plugin-transform-do-expressions'
	// ),
	// ...addBabelPresets([
	// 	[
	// 		'@babel/env',
	// 		{
	// 			targets: {
	// 				browsers: ['> 1%', 'last 2 versions']
	// 			},
	// 			modules: 'commonjs'
	// 		}
	// 	],
	// 	'@babel/preset-flow',
	// 	'@babel/preset-react'
	// ]),
	// fixBabelImports('lodash', {
	// 	libraryDirectory: '',
	// 	camel2DashComponentName: false
	// }),
	fixBabelImports('react-feather', {
		libraryName: 'react-feather',
		libraryDirectory: 'dist/icons'
	}),
	process.env.BUNDLE_VISUALIZE == 1 && addBundleVisualizer(),
	// addWebpackAlias({
	// 	['ag-grid-react$']: path.resolve(__dirname, 'src/shared/agGridWrapper.js')
	// }),
	adjustWorkbox(wb =>
		Object.assign(wb, {
			skipWaiting: true,
			exclude: (wb.exclude || []).concat('index.html')
		})
	),
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
