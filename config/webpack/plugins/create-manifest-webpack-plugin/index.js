const path = require("path");

const { version } = require(path.resolve(process.env.ROOT_DIR, "package.json"));

class CreateManifestPlugin {
	constructor(scripts) {
		this.scripts = {};
		this.manifest = require("./manifest-template.json");
		this.scripts.document_start = {
			...(scripts.before || {}),
			...(scripts.injected || {}),
			...(scripts.injected_and_loaded || {})
		};
		this.scripts.document_end = scripts.rendered || {};
		this.scripts.document_idle = scripts.loaded || {};
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("CreateManifestPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateManifestPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
					additionalAssets: true
				},
				assets => {
					this.manifest.version = version;
					this.manifest.content_scripts = []

					for (const scriptType in this.scripts) {
						if (Object.keys(this.scripts[scriptType]).length > 0) {
							this.manifest.content_scripts.push({
								matches: ["https://banglarbhumi.gov.in/*", "http://banglarbhumi.gov.in/*"],
								js: Object.keys(this.scripts[scriptType]).map(scriptName => `${scriptName}.js`),
								run_at: scriptType
							});
						}
					}

					const { RawSource } = compiler.webpack.sources;
					assets["manifest.json"] = new RawSource(Buffer.from(JSON.stringify(this.manifest)));
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
