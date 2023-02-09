const { sources } = require("webpack");
const path = require("path");

const { version } = require(path.resolve(process.env.ROOT_DIR, "package.json"));
const { getScriptRuntimeFromType } = require(path.resolve(process.env.CONFIG_DIR, "webpack/utils/script-runtime"));

class CreateManifestPlugin {
	constructor({ scripts }) {
		this.scripts = {};
		this.manifest = require("./manifest-template.json");
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
									js: [`${scriptRuntime}.js`],
									run_at: scriptRuntime
								});
							}
						}
					}

					compilation.updateAsset(
						"manifest.json",
						new sources.RawSource(JSON.stringify(this.manifest))
					);
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
