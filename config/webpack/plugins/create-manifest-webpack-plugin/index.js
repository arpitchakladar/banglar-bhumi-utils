import webpack from "webpack";
import path from "path";
import fs from "fs";

import { getScriptRuntimeFromType } from "../../utils/script-runtime.js";
import { getFileName } from "../../utils/build-file.js";
import scripts from "../../utils/scripts.js";
const manifest = JSON.parse(
	fs.readFileSync(
		path.resolve("config/webpack/plugins/create-manifest-webpack-plugin/manifest-template.json"),
	),
);

class CreateManifestPlugin {
	constructor({ sharedModulesImportedCount, injectedSharedModulesImportedCount, sortedSharedModules }) {
		this.sharedModulesImportedCount = sharedModulesImportedCount;
		this.injectedSharedModulesImportedCount = injectedSharedModulesImportedCount;
		this.sortedSharedModules = sortedSharedModules;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("CreateManifestPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateManifestPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				},
				assets => {
					manifest.version = JSON.parse(fs.readFileSync((path.resolve(ROOT_DIR, "package.json")))).version;
					manifest.content_scripts = [];
					let resources = [];

					const arrangedScripts = {};

					for (const scriptPath in scripts) {
						arrangedScripts[scriptPath] = {};

						for (const scriptType in scripts[scriptPath]) {
							const scriptRuntime = getScriptRuntimeFromType(scriptType);

							if (typeof arrangedScripts[scriptPath][scriptRuntime] === "undefined") {
								arrangedScripts[scriptPath][scriptRuntime] = [];
							}

							arrangedScripts[scriptPath][scriptRuntime].push(`scripts/${getFileName(scriptType, scriptPath)}.js`);
							if (scriptType.startsWith("injected")) {
								resources.push(`scripts/injected/${getFileName(scriptType, scriptPath)}.js`);
							}
						}
					}

					manifest.content_scripts.push({
						matches: [`*://banglarbhumi.gov.in/BanglarBhumi/*`],
						js: this.sortedSharedModules
							.filter(sharedModule => this.sharedModulesImportedCount[sharedModule] > 0)
							.map(sharedModule => `shared/${getFileName(sharedModule, "shared")}.js`)
							.concat(arrangedScripts["*"]["document_start"])
							.filter(x => x != null),
						run_at: "document_start"
					});

					delete arrangedScripts["*"]["document_start"];

					for (const scriptPath in arrangedScripts) {
						const matches = [`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}*`];

						if (scriptPath === "Home")
							matches.push(`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}.action*`);

						for (const scriptRuntime in arrangedScripts[scriptPath]) {
							manifest.content_scripts.push({
								matches,
								js: arrangedScripts[scriptPath][scriptRuntime],
								run_at: scriptRuntime
							});
						}
					}

					for (const assetName in assets) {
						if (/^assets\/.*\.(jpg|png|gif)$/.test(assetName)) {
							resources.push(assetName);
						}
					}

					const injectedSharedModules = this.sortedSharedModules
						.filter(sharedModule => this.injectedSharedModulesImportedCount[sharedModule] > 0)
						.map(sharedModule => `shared/${getFileName(sharedModule, "shared")}.js`);

					if (injectedSharedModules.length > 0) {
						resources = resources.concat(injectedSharedModules);
						manifest.content_scripts[0].js.unshift(`shared/${getFileName("injected-shared-modules", "shared")}.js`);
					}

					manifest.content_scripts[0].js.unshift(`shared/${getFileName("script-injector", "shared")}.js`);

					if (resources.length > 0) {
						manifest.web_accessible_resources = [
							{
								resources,
								matches: ["<all_urls>"]
							}
						];
					}

					manifest.background = { service_worker: "background.js" };

					compilation.emitAsset(
						"manifest.json",
						new webpack.sources.RawSource(
							JSON.stringify(
								manifest,
								undefined,
								process.env.NODE_ENV === "production"
									? undefined
									: "\t"
							)
						)
					);
				}
			);
		});
	}
}

export default CreateManifestPlugin;

