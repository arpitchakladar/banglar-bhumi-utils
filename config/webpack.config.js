const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

global.ROOT_DIR = path.resolve(__dirname, "..");
global.CONFIG_DIR = path.resolve(ROOT_DIR, "config");
global.SOURCE_DIR = path.resolve(ROOT_DIR, "src");

global.webpackRequire = modulePath => require(path.resolve(CONFIG_DIR, "webpack", modulePath));

const CreateManifestPlugin = webpackRequire("plugins/create-manifest-webpack-plugin");
const SanitizeScriptsImportPlugin = webpackRequire("plugins/sanitize-scripts-import-webpack-plugin");
const InjectScriptPlugin = webpackRequire("plugins/inject-script-webpack-plugin");

const { inlineJavascript } = webpackRequire("utils/inline-javascript");
const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/file-name-hash");

const scripts = require(path.resolve(SOURCE_DIR, "scripts.json"));

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
			import: inlineJavascript(Object.keys(scripts).map(script => `import "${path.resolve(SOURCE_DIR, "scripts", script)}";`).join("\n")),
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
			"@": global.SOURCE_DIR
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
				test: new RegExp(`^${path.resolve(SOURCE_DIR, "scripts")}`),
				loader: path.resolve(CONFIG_DIR, "webpack/loaders/scoped-loader")
			}
		]
	},
	plugins: [
		new SanitizeScriptsImportPlugin(),
		new InjectScriptPlugin(),
		new CopyPlugin({
			patterns: [{
				from: path.resolve(ROOT_DIR, "static"),
				to: "./"
			}]
		}),
		new CreateManifestPlugin()
	]
};
