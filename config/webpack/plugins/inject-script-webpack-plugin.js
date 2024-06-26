const { sources } = require("webpack");
const path = require("path");

const { getFileName } = webpackRequire("utils/build-file");
const { getInjectedCode } = webpackRequire("utils/injected-code");

class InjectScriptPlugin {
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
							const injectedCodeResponse = getInjectedCode(compilation.getAsset(assetName).source.source())
							const scriptInjectorModuleName = getFileName("script-injector", "shared", true);
							compilation.updateAsset(
								assetName,
								new sources.RawSource(injectedCodeResponse[0])
							);
							assets["scripts/" + path.basename(assetName)] = new sources.RawSource(
								`$${scriptInjectorModuleName}.injectScriptHead("scripts/injected/${path.basename(assetName)}", ${injectedCodeResponse[1]});`
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
