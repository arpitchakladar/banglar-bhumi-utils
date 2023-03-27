const { sources } = require("webpack");

const { getInjectionCode } = webpackRequire("utils/get-injection-code");

class InjectScriptPlugin {
	constructor(insertedBefore = false) {
		this.insertedBefore = insertedBefore;
	}

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
						if (/\.js$/.test(assetName)) {
							compilation.updateAsset(
								assetName,
								new sources.RawSource(
									getInjectionCode(
										compilation.getAsset(assetName).source.source(),
										this.insertedBefore
									)
								)
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
