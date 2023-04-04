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

					manifest.content_scripts.push({
						matches: [`*://banglarbhumi.gov.in/BanglarBhumi/*`],
						js: this.sortedSharedModules
							.filter(sharedModule => this.sharedModulesImportedCount[sharedModule] > 0)
							.map(sharedModule => `shared/${getFileNameHash(sharedModule, "shared")}.js`),
						run_at: "document_start"
					});

					for (const scriptPath in scripts) {
						for (const scriptType in scripts[scriptPath]) {
							const matches = [`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}`];

							if (scriptPath === "Home")
								matches.push(`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}.action`);

							manifest.content_scripts.push({
								matches,
								js: [`scripts/${getFileNameHash(scriptType, scriptPath)}.js`],
								run_at: getScriptRuntimeFromType(scriptType)
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
