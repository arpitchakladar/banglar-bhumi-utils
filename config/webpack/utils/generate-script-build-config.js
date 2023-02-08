const fs = require("fs");
const path = require("path");

const SanitizeScriptsImportPlugin = require("../plugins/sanitize-scripts-import-webpack-plugin");
const InjectScriptPlugin = require("../plugins/inject-script-webpack-plugin");
const inlineJavascript = require("./inline-javascript");

const scripts = require(path.resolve(process.env.SOURCE_DIR, "scripts.json"));

const getImportStatementForScript = script => {
	const importPath = path.resolve(process.env.SOURCE_DIR, "scripts", script);
	return `import "${importPath}";`;
};

const getVirtualEntry = scriptType => {
	const importStatements = Object.keys(scripts[scriptType]).map(getImportStatementForScript).join("\n");

	return inlineJavascript(importStatements);
}

let injectedScriptsCount = 0;
const generateScriptBuildConfig = scriptType => {
	return {
		entry: getVirtualEntry(scriptType),
		name: scriptType,
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
				isFirst: injectedScriptsCount++ <= 0
			})]
			: []
		)
	};
};

module.exports = generateScriptBuildConfig;
