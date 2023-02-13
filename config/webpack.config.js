const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

global.ROOT_DIR = path.resolve(__dirname, "..");
global.CONFIG_DIR = path.resolve(ROOT_DIR, "config");
global.SOURCE_DIR = path.resolve(ROOT_DIR, "src");

global.webpackRequire = modulePath => require(path.resolve(CONFIG_DIR, "webpack", modulePath));

const CreateManifestPlugin = webpackRequire("plugins/create-manifest-webpack-plugin");
const InjectScriptPlugin = webpackRequire("plugins/inject-script-webpack-plugin");

const { inlineJavascript } = webpackRequire("utils/inline-javascript");
const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/file-name-hash");
const { formatScripts } = webpackRequire("utils/format-scripts");

const scripts = formatScripts(require(path.resolve(SOURCE_DIR, "scripts.json")));

const entries = {};

for (const scriptPath in scripts) {
	for (const scriptType in scripts[scriptPath]) {
		const currentScripts = scripts[scriptPath][scriptType];
		entries[`${scriptType} - "${scriptPath}"`] = {
			import: inlineJavascript(currentScripts.map(script => `import "${path.resolve(SOURCE_DIR, "scripts", script)}";`).join("\n")),
			filename: `scripts/${getFileNameHash(scriptPath)}/${scriptType}.js`
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
				test: /\.(jpg|png|gif)$/,
				loader: "url-loader"
			}
		]
	},
	plugins: [
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
