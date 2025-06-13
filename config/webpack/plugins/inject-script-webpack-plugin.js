import webpack from "webpack";
import path from "path";

import { getFileName } from "../utils/build-file.js";
import { getInjectedCode } from "../utils/injected-code.js";

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
								new webpack.sources.RawSource(injectedCodeResponse[0])
							);
							assets["scripts/" + path.basename(assetName)] = new webpack.sources.RawSource(
								`$${scriptInjectorModuleName}.injectScriptHead("scripts/injected/${path.basename(assetName)}", ${injectedCodeResponse[1]});`
							);
						}
					}
				}
			);
		});
	}
}

export default InjectScriptPlugin;
