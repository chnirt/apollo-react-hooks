const { override, fixBabelImports, addLessLoader } = require('customize-cra')
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin')

const addProgressBarPlugin = () => config => {
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
			complete: '◆',
			incomplete: '◇'
		})
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
	addProgressBarPlugin()
)
