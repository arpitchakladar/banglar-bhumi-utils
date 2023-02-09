const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

process.env.ROOT_DIR = path.resolve(__dirname, "..");
process.env.CONFIG_DIR = path.resolve(process.env.ROOT_DIR, "config");
process.env.SOURCE_DIR = path.resolve(process.env.ROOT_DIR, "src");

const CreateManifestPlugin = require(path.resolve(process.env.CONFIG_DIR, "webpack/plugins/create-manifest-webpack-plugin"));
const SanitizeScriptsImportPlugin = require(path.resolve(process.env.CONFIG_DIR, "webpack/plugins/sanitize-scripts-import-webpack-plugin"));
const InjectScriptPlugin = require(path.resolve(process.env.CONFIG_DIR, "webpack/plugins/inject-script-webpack-plugin"));
const { inlineJavascript } = require(path.resolve(process.env.CONFIG_DIR, "webpack/utils/inline-javascript"));
const { getScriptRuntimeFromType } = require(path.resolve(process.env.CONFIG_DIR, "webpack/utils/script-runtime"));

const scripts = require(path.resolve(process.env.SOURCE_DIR, "scripts.json"));

let scriptBuildConfigs = [];

let injectedScriptsCount = 0;

const allScripts = {
	document_start: {
		...(scripts.before || {}),
		...(scripts.injected || {}),
		...(scripts.injected_and_loaded || {})
	},
	document_end: scripts.rendered,
	document_idle: scripts.loaded
};

for (const scriptRuntime in allScripts) {
	if (allScripts[scriptRuntime]) {
		const importStatements = Object.keys(allScripts[scriptRuntime]).map(script =>
			`import "${path.resolve(process.env.SOURCE_DIR, "scripts", script)}";`
		).join("\n");

		scriptBuildConfigs.push({
			entry: inlineJavascript(importStatements),
			name: scriptRuntime,
			mode: "production",
			output: {
				filename: `scripts/${scriptRuntime}.js`
			},
			resolve: {
				extensions: ["", ".ts", ".js"],
				alias: {
					"@": process.env.SOURCE_DIR
				}
			},
			module: {
				rules: [
					{
						test: /\.tsx?$/,
						loader: "ts-loader",
						options: {
							configFile: "config/tsconfig.json"
						}
					},
					{
						test: new RegExp(`^${path.resolve(process.env.SOURCE_DIR, "scripts")}`),
						loader: path.resolve(process.env.CONFIG_DIR, "webpack/loaders/scoped-loader")
					}
				]
			},
			plugins: [
				new SanitizeScriptsImportPlugin()
			].concat(
				scriptRuntime === "document_start"
				? [new InjectScriptPlugin()]
				: []
			)
		});
	}
}

scriptBuildConfigs.push({
	name: "manifest",
	entry: inlineJavascript(""),
	output: {
		filename: `manifest.json`
	},
	plugins: [
		new CopyPlugin({
			patterns: [{
				from: path.resolve(process.env.ROOT_DIR, "static"),
				to: "./"
			}]
		}),
		new CreateManifestPlugin({ scripts })
	]
});

module.exports = scriptBuildConfigs;
