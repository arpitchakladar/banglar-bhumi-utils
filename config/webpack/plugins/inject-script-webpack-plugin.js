const { sources } = require("webpack");
const path = require("path");

const { getFileNameHash } = webpackRequire("utils/filename-hash");

class InjectScriptPlugin {
	constructor(insertedBefore = false) {
		this.insertedBefore = insertedBefore;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("InjectScriptPlugin", compilation => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: "InjectScriptPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
					additionalAssets: true
				},
				async assets => {
					for (const assetName in assets) {
						if (/\.js$/.test(assetName)) {
							assets["scripts/" + path.basename(assetName)] = new sources.RawSource(
								`$${getFileNameHash("script-injector", "shared", true)}.injectScriptHead("scripts/injected/${path.basename(assetName)}");`
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
