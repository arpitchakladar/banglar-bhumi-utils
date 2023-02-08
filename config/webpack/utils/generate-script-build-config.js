const fs = require("fs");
const path = require("path");

const SanitizeScriptsImportPlugin = require("../plugins/sanitize-scripts-import-webpack-plugin");
const InjectScriptPlugin = require("../plugins/inject-script-webpack-plugin");

const manifest = require(path.resolve(process.env.SOURCE_DIR, "manifest.json"));

let count = 0;

const getImportStatementForScript = script => {
	const importPath = path.resolve(process.env.SOURCE_DIR, "scripts", script);
	return `import "${importPath}";`;
};

const getVirtualEntry = scriptType => {
	const string = Object.keys(manifest[scriptType]).map(getImportStatementForScript).join("\n");

	const base64 = Buffer.from(string).toString("base64");
	return `data:text/javascript;base64,${base64}`;
}

const generateScriptBuildConfig = scriptType => {
	return {
		entry: getVirtualEntry(scriptType),
		mode: "production",
		output: {
			filename: `${scriptType}.js`
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
			scriptType.startsWith("injected")
			? [new InjectScriptPlugin({
				onload: scriptType === "injected_and_loaded",
				isFirst: count++ <= 0
			})]
			: []
		)
	};
};

module.exports = generateScriptBuildConfig;
