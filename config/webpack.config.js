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
const { getFileNameHash } = require(path.resolve(process.env.CONFIG_DIR, "webpack/utils/file-name-hash"));

const scripts = require(path.resolve(process.env.SOURCE_DIR, "scripts.json"));

let scriptBuildConfigs = [];

let injectedScriptsCount = 0;

const entries = {};

const _scripts = {};

for (const scriptType in scripts) {
	_scripts[getScriptRuntimeFromType(scriptType)] = {
		..._scripts[getScriptRuntimeFromType(scriptType)],
		...scripts[scriptType]
	};
}

for (const scriptRuntime in _scripts) {
	const scripts = _scripts[scriptRuntime];
	for (const script in scripts) {
		const scriptPath = scripts[script];
		entries[`${scriptRuntime} - "${scriptPath}"`] = {
			import: inlineJavascript(Object.keys(scripts).map(script =>
				`import "${path.resolve(process.env.SOURCE_DIR, "scripts", script)}";`
			).join("\n")),
			filename: `scripts/${getFileNameHash(scriptPath)}/${scriptRuntime}.js`
		};
	}
}

module.exports = {
	entry: entries,
	mode: "production",
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
		new SanitizeScriptsImportPlugin(),
		new InjectScriptPlugin(),
		new CopyPlugin({
			patterns: [{
				from: path.resolve(process.env.ROOT_DIR, "static"),
				to: "./"
			}]
		}),
		new CreateManifestPlugin()
	]
};
