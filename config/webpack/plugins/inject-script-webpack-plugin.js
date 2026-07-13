import path from "path";

import webpack from "webpack";

import { getFileName } from "../utils/build-file.js";
import { getInjectedCode } from "../utils/injected-code.js";

/**
 * Webpack plugin that post-processes every `.js` asset to replace
 * extension-asset URL placeholders with runtime lookup code, and
 * emits an additional "injected" script that the content script
 * injects into the page via the script-injector module.
 */
class InjectScriptPlugin {
	/**
	 * @param {import("webpack").Compiler} compiler
	 * @returns {void}
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap("InjectScriptPlugin", (compilation) => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: "InjectScriptPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL,
					additionalAssets: true
				},
				async(assets) => {
					for (const assetName in assets) {
						if (/\.js$/.test(assetName)) {
							const assetSource = compilation.getAsset(assetName).source.source();
							const injectedCodeResponse = getInjectedCode(assetSource);
							const scriptInjectorModuleName = getFileName("script-injector", "shared", true);
							compilation.updateAsset(
								assetName,
								new webpack.sources.RawSource(injectedCodeResponse[0])
							);
							const injectedFileName = `scripts/injected/${path.basename(assetName)}`;
							assets["scripts/" + path.basename(assetName)] = new webpack.sources.RawSource(
								`$${scriptInjectorModuleName}.injectScriptHead("${injectedFileName}", ${injectedCodeResponse[1]});`
							);
						}
					}
				}
			);
		});
	}
}

export default InjectScriptPlugin;
