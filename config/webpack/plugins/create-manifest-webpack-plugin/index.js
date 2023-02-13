const { sources } = require("webpack");
const path = require("path");

const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/file-name-hash");
const { formatScripts } = webpackRequire("utils/format-scripts");

class CreateManifestPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("CreateManifestPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateManifestPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_ADDITIONAL,
					additionalAssets: true
				},
				() => {
					const scripts = formatScripts(require(path.resolve(SOURCE_DIR, "scripts.json")));
					const manifest = webpackRequire("plugins/create-manifest-webpack-plugin/manifest-template.json");
					manifest.version = require(path.resolve(ROOT_DIR, "package.json")).version;
					manifest.content_scripts = []

					for (const scriptPath in scripts) {
						for (const scriptType in scripts[scriptPath]) {
							manifest.content_scripts.push({
								matches: [`*://banglarbhumi.gov.in/BanglarBhumi/${scriptPath}`],
								js: [`scripts/${getFileNameHash(scriptPath)}/${scriptType}.js`],
								run_at: getScriptRuntimeFromType(scriptType)
							});
						}
					}

					compilation.emitAsset(
						"manifest.json",
						new sources.RawSource(JSON.stringify(manifest))
					);
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
