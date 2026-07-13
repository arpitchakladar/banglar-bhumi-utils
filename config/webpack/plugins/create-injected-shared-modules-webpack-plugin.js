import path from "path";
import webpack from "webpack";

import { getFileName } from "../utils/build-file.js";

/**
 * Webpack plugin that generates an injected shared-modules bundle.
 * After all assets are processed, it creates a small JS file that
 * calls the script injector for each shared module that was imported
 * by injected scripts.
 */
class CreateInjectedSharedModulesPlugin {
	/**
	 * @param {{ injectedSharedModulesImportedCount: Record<string, number>, sortedSharedModules: string[] }} options
	 */
	constructor({ injectedSharedModulesImportedCount, sortedSharedModules }) {
		this.injectedSharedModulesImportedCount = injectedSharedModulesImportedCount;
		this.sortedSharedModules = sortedSharedModules;
	}

	/**
	 * @param {import("webpack").Compiler} compiler
	 */
	apply(compiler) {
		compiler.hooks.compilation.tap("CreateInjectedSharedModulesPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateInjectedSharedModulesPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				},
				(_assets) => {
					const injectedSharedScripts = this.sortedSharedModules
						.filter(sharedModule => this.injectedSharedModulesImportedCount[sharedModule] > 0)
						.map(sharedModule => `shared/${getFileName(sharedModule, "shared")}.js`);

					if (injectedSharedScripts.length > 0) {
						const scriptInjectorModuleName = getFileName("script-injector", "shared", true);
						const injectionCode = injectedSharedScripts
							.map(injectedScript => `$${scriptInjectorModuleName}.injectScriptHead("shared/${path.basename(injectedScript)}");`)
							.join("");
						compilation.emitAsset(
							`shared/${getFileName("injected-shared-modules", "shared")}.js`,
							new webpack.sources.RawSource(injectionCode)
						);
					}
				}
			);
		});
	}
}

export default CreateInjectedSharedModulesPlugin;
