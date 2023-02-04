const fs = require("fs");
const path = require("path");
const CopyPlugin = require("copy-webpack-plugin");
const manifest = require("./static/manifest.json");

const SOURCE_DIR = path.resolve(__dirname, "src");
const STATIC_DIR = path.resolve(__dirname, "static");

const generateScriptBuildConfig = script => {
	const scriptName = script.substring(0, script.length - 3);
	let entry = path.resolve(SOURCE_DIR, `scripts/${scriptName}.ts`);
	if (!fs.existsSync(entry)) {
		entry = path.resolve(SOURCE_DIR, `scripts/${scriptName}/index.ts`);
	}

	return {
		entry,
		mode: "production",
		output: {
			filename: `${scriptName}.js`
		},
		resolve: {
			extensions: ["", ".ts", ".js", ".sjs"],
			alias: {
				"@": SOURCE_DIR
			}
		},
		module: {
			rules: [
				{ test: /\.sjs$/, loader: "raw-loader" },
				{ test: /\.tsx?$/, loader: "ts-loader" }
			]
		}
	};
};

let scripts = [];

for (const script of manifest.content_scripts) {
	scripts = scripts.concat(script.js.map(generateScriptBuildConfig));
}

scripts[scripts.length - 1].plugins = (scripts[scripts.length - 1].plugins || []).concat([
	new CopyPlugin({
		patterns: [{
			from: STATIC_DIR,
			to: "./"
		}]
	})
]);

module.exports = scripts;
