const { sources } = require("webpack");
const terser = require("terser");

const { getInjectionCode } = webpackRequire("plugins/inject-script-webpack-plugin/get-injection-code");

class InjectScriptPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("InjectScriptPlugin", compilation => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: "InjectScriptPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ANALYSE,
					additionalAssets: true
				},
				async assets => {
					for (const assetName in assets) {
						if (assetName.endsWith("injected.js")) {
							compilation.updateAsset(
								assetName,
								new sources.RawSource(getInjectionCode(compilation.getAsset(assetName).source.source()))
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
