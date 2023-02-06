const fs = require("fs");
const path = require("path");

const InjectScriptPlugin = require("../plugins/inject-script-webpack-plugin");

const manifest = require(path.resolve(process.env.SOURCE_DIR, "manifest.json"));

let count = 0;

const generateScriptBuildConfig = (scriptName, scriptType) => {
	let entry = path.resolve(process.env.SOURCE_DIR, `scripts/${scriptName}.ts`);
	if (!fs.existsSync(entry)) {
		entry = path.resolve(process.env.SOURCE_DIR, `scripts/${scriptName}/index.ts`);
		if (!fs.existsSync(entry)) {
			entry = path.resolve(process.env.SOURCE_DIR, `scripts/${scriptName}.js`);
		}
	}

	return {
		entry,
		mode: "production",
		output: {
			filename: `${scriptName}.js`
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
				}
			]
		},
		plugins: scriptType.startsWith("injected")
			? [new InjectScriptPlugin({
				onload: scriptType === "injected_and_loaded",
				isFirst: count++ <= 0
			})]
			: undefined
	};
};

module.exports = generateScriptBuildConfig;
