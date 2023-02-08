const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

process.env.ROOT_DIR = path.resolve(__dirname, "..");
process.env.CONFIG_DIR = path.resolve(process.env.ROOT_DIR, "config");
process.env.SOURCE_DIR = path.resolve(process.env.ROOT_DIR, "src");

const CreateManifestPlugin = require("./webpack/plugins/create-manifest-webpack-plugin");
const generateScriptBuildConfig = require("./webpack/utils/generate-script-build-config");
const inlineJavascript = require("./webpack/utils/inline-javascript");

const scripts = require(path.resolve(process.env.SOURCE_DIR, "scripts.json"));

let scriptBuildConfigs = [];

for (const scriptType in scripts) {
	scriptBuildConfigs.push(generateScriptBuildConfig(scriptType));
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
