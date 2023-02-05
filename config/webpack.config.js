const fs = require("fs");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

process.env.ROOT_DIR = path.resolve(__dirname, "..");
process.env.SOURCE_DIR = path.resolve(process.env.ROOT_DIR, "src");
process.env.STATIC_DIR = path.resolve(process.env.ROOT_DIR, "static");

const InjectScriptPlugin = require("./webpack/plugins/inject-script-webpack-plugin");
const CreateManifestPlugin = require("./webpack/plugins/create-manifest-webpack-plugin");

const manifest = require(path.resolve(process.env.SOURCE_DIR, "manifest.json"));

const generateScriptBuildConfig = (script, scriptType) => {
	const scriptName = script.substring(0, script.length - 3);
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
			? [new InjectScriptPlugin({ onload: scriptType === "injected_and_loaded" })]
			: undefined
	};
};

let scripts = [];

for (const scriptType in manifest) {
	for (const scriptName in manifest[scriptType]) {
		scripts.push(generateScriptBuildConfig(scriptName, scriptType));
	}
}

scripts[scripts.length - 1].plugins = (scripts[scripts.length - 1].plugins || []).concat([
	new CopyPlugin({
		patterns: [{
			from: process.env.STATIC_DIR,
			to: "./"
		}]
	}),
	new CreateManifestPlugin(manifest)
]);

module.exports = scripts;
