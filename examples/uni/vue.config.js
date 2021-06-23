const path = require('path')

module.exports = {
	configureWebpack: {
		resolve: {
			alias: {
				prequest: path.resolve(__dirname, './src/common/http/index.ts')
			}
		}
	},
  transpileDependencies: [/@prequest/]
}
