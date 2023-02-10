const { sources } = require("webpack");
const path = require("path");

const scripts = require(path.resolve(SOURCE_DIR, "scripts.json"));

const { version } = require(path.resolve(ROOT_DIR, "package.json"));
const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/file-name-hash");

class CreateManifestPlugin {
	constructor() {
		this.scripts = {};
		this.manifest = webpackRequire("plugins/create-manifest-webpack-plugin/manifest-template.json");
		for (const scriptType in scripts) {
			const scriptRuntime = getScriptRuntimeFromType(scriptType);
			this.scripts[scriptRuntime] = { ...this.scripts[scriptRuntime], ...scripts[scriptType] };
		}
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("CreateManifestPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateManifestPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_ADDITIONAL,
					additionalAssets: true
				},
				() => {
					this.manifest.version = version;
					this.manifest.content_scripts = []

					for (const scriptRuntime in this.scripts) {
						if (Object.keys(this.scripts[scriptRuntime]).length > 0) {
							const currentScripts = this.scripts[scriptRuntime];

							let paths = {};
							for (const scriptName in currentScripts) {
								const scriptPath = currentScripts[scriptName];
								if (!path[scriptPath]) {
									paths[scriptPath] = [];
								}
								paths[scriptPath].push(scriptName);
							}

							for (const scriptPath in paths) {
								this.manifest.content_scripts.push({
									matches: [`*://banglarbhumi.gov.in/${scriptPath}`],
									js: [`scripts/${getFileNameHash(scriptPath)}/${scriptRuntime}.js`],
									run_at: scriptRuntime
								});
							}
						}
					}

					compilation.emitAsset(
						"manifest.json",
						new sources.RawSource(JSON.stringify(this.manifest))
					);
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
