const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");

process.env.ROOT_DIR = path.resolve(__dirname, "..");
process.env.SOURCE_DIR = path.resolve(process.env.ROOT_DIR, "src");

const CreateManifestPlugin = require("./webpack/plugins/create-manifest-webpack-plugin");
const generateScriptBuildConfig = require("./webpack/utils/generate-script-build-config");

const manifest = require(path.resolve(process.env.SOURCE_DIR, "manifest.json"));

let scripts = [];

for (const scriptType in manifest) {
	for (const scriptName in manifest[scriptType]) {
		scripts.push(generateScriptBuildConfig(scriptName, scriptType));
	}
}

scripts[scripts.length - 1].plugins = (scripts[scripts.length - 1].plugins || []).concat([
	new CopyPlugin({
		patterns: [{
			from: path.resolve(process.env.ROOT_DIR, "static"),
			to: "./"
		}]
	}),
	new CreateManifestPlugin(manifest)
]);

module.exports = scripts;
