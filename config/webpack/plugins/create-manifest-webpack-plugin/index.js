const path = require("path");

const { version } = require(path.resolve(process.env.ROOT_DIR, "package.json"));

const getRunAt = scriptType => {
	switch (scriptType) {
		case "before":
		case "injected":
		case "injected_and_loaded":
			return "document_start";

		case "rendered":
			return "document_end";

		case "loaded":
		default:
			return "document_idle";
	}
};

class CreateManifestPlugin {
	constructor({ scripts }) {
		this.scripts = {};
		this.manifest = require("./manifest-template.json");
		this.scripts.before = scripts.before || {};
		this.scripts.injected = scripts.injected || {};
		this.scripts.injected_and_loaded = scripts.injected_and_loaded || {};
		this.scripts.rendered = scripts.rendered || {};
		this.scripts.loaded = scripts.loaded || {};
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
							const currentScripts = this.scripts[scriptType];

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
									js: [`${scriptType}.js`],
									run_at: getRunAt(scriptType)
								});
							}
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
