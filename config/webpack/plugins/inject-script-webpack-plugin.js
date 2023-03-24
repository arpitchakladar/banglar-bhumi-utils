const { sources } = require("webpack");
const terser = require("terser");

const { getInjectionCode } = webpackRequire("utils/get-injection-code");

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
						let injected = false;
						let injected_before = false;

						if (assetName.endsWith("injected.js"))
							injected = true;

						else if (assetName.endsWith("injected-before.js")) {
							injected = true;
							injected_before = true;
						}

						if (injected) {
							compilation.updateAsset(
								assetName,
								new sources.RawSource(getInjectionCode(compilation.getAsset(assetName).source.source(), injected_before))
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
