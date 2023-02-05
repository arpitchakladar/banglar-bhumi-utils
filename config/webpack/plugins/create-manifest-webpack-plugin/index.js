const path = require("path");

const { version } = require(path.resolve(process.env.ROOT_DIR, "package.json"));

const scriptTypeRunAtMap = {
	injected: "document_start",
	rendered: "document_end",
	loaded: "document_idle"
};

class CreateManifestPlugin {
	constructor(scripts) {
		this.scripts = scripts;
		this.manifest = require("./manifest-template.json");
		this.scripts.injected = this.scripts.injected
			? { ...this.scripts.injected, ...(this.scripts.injected_and_loaded || {}) }
			: this.scripts.injected_and_loaded;
		this.scripts.injected_and_loaded = undefined;
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

					for (const scriptType in scriptTypeRunAtMap) {
						if (this.scripts[scriptType]) {
							this.manifest.content_scripts.push({
								matches: ["https://banglarbhumi.gov.in/*", "http://banglarbhumi.gov.in/*"],
								js: Object.keys(this.scripts[scriptType]),
								run_at: scriptTypeRunAtMap[scriptType]
							});
						}
					}

					const encoder = new TextEncoder("UTF-8");
					const { RawSource } = compiler.webpack.sources;
					assets["manifest.json"] = new RawSource(Buffer.from(encoder.encode(JSON.stringify(this.manifest).buffer)));
				}
			);
		});
	}
}

module.exports = CreateManifestPlugin;
