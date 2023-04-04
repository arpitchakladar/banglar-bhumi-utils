const { sources } = require("webpack");
const path = require("path");

const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/filename-hash");
const scripts = webpackRequire("utils/scripts");
const manifest = webpackRequire("plugins/create-manifest-webpack-plugin/manifest-template.json");

class CreateManifestPlugin {
	constructor({ sharedModulesImportedCount, sortedSharedModules }) {
		this.sharedModulesImportedCount = sharedModulesImportedCount;
		this.sortedSharedModules = sortedSharedModules;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("CreateManifestPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateManifestPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_ADDITIONAL,
					additionalAssets: true
				},
				assets => {
					manifest.version = require(path.resolve(ROOT_DIR, "package.json")).version;
					manifest.content_scripts = [];

					const arrangedScripts = {};

					for (const scriptPath in scripts) {
						arrangedScripts[scriptPath] = {};

						for (const scriptType in scripts[scriptPath]) {
							const scriptRuntime = getScriptRuntimeFromType(scriptType);

							if (typeof arrangedScripts[scriptPath][scriptRuntime] === "undefined") {
								arrangedScripts[scriptPath][scriptRuntime] = [];
							}

							arrangedScripts[scriptPath][scriptRuntime].push(`scripts/${getFileNameHash(scriptType, scriptPath)}.js`);
						}
					}

					manifest.content_scripts.push({
						matches: [`*://banglarbhumi.gov.in/BanglarBhumi/*`],
						js: this.sortedSharedModules
							.filter(sharedModule => this.sharedModulesImportedCount[sharedModule] > 0)
							.map(sharedModule => `shared/${getFileNameHash(sharedModule, "shared")}.js`)
							.concat(arrangedScripts["*"]["document_start"]),
						run_at: "document_start"
					});

					delete arrangedScripts["*"]["document_start"];

					for (const scriptPath in arrangedScripts) {
						const matches = [`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}`];

						if (scriptPath === "Home")
							matches.push(`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}.action`);

						for (const scriptRuntime in arrangedScripts[scriptPath]) {
							manifest.content_scripts.push({
								matches,
								js: arrangedScripts[scriptPath][scriptRuntime],
								run_at: scriptRuntime
							});
						}
					}

					const resources = [];

					for (const assetName in assets) {
						if (/^assets\/.*\.(jpg|png|gif)$/.test(assetName)) {
							resources.push(assetName);
						}
					}

					if (resources.length > 0) {
						manifest.web_accessible_resources = [
							{
								resources,
								matches: ["<all_urls>"]
							}
						];
					}

					compilation.emitAsset(
						"manifest.json",
						new sources.RawSource(JSON.stringify(manifest, undefined, process.env.NODE_ENV === "production" ? undefined : "\t"))
					);
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
