const path = require("path");
const fs = require("fs");
const { merge } = require("webpack-merge");
const CopyPlugin = require("copy-webpack-plugin");

global.ROOT_DIR = path.resolve(__dirname, "..");
global.CONFIG_DIR = path.resolve(ROOT_DIR, "config");
global.SOURCE_DIR = path.resolve(ROOT_DIR, "src");
global.production = process.env.NODE_ENV === "production";

global.webpackRequire = modulePath => require(path.resolve(CONFIG_DIR, "webpack", modulePath));

const CreateManifestPlugin = webpackRequire("plugins/create-manifest-webpack-plugin");
const CreateRulesPlugin = webpackRequire("plugins/create-rules-webpack-plugin");
const InjectScriptPlugin = webpackRequire("plugins/inject-script-webpack-plugin");

const { inlineJavascript } = webpackRequire("utils/inline-javascript");
const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/filename-hash");

const scripts = webpackRequire("utils/scripts");

const sharedModules = webpackRequire("utils/shared-modules");

const sharedModulesImportedCount = {};

for (const sharedModule of sharedModules) {
	sharedModulesImportedCount[sharedModule] = 0;
}

const uninjectedScriptEntries = {};
const injectedAfterScriptEntries = {};
const injectedBeforeScriptEntries = {};
const sharedModuleEntries = {};
const sharedModuleExternals = {};

for (const scriptPath in scripts) {
	for (const scriptType in scripts[scriptPath]) {
		const currentScripts = scripts[scriptPath][scriptType];
		let scriptEntries;

		switch (scriptType) {
		case "injected":
			scriptEntries = injectedAfterScriptEntries;
			break;

		case "injected-before":
			scriptEntries = injectedBeforeScriptEntries;
			break;

		default:
			scriptEntries = uninjectedScriptEntries;
		}

		scriptEntries[`${scriptType} - "${scriptPath}"`] = {
			import: inlineJavascript(currentScripts.map(script => `import "${path.resolve(SOURCE_DIR, "scripts", script)}";`).join("\n")),
			filename: `scripts/${getFileNameHash(scriptType, scriptPath)}.js`
		};
	}
}

for (const sharedModule of sharedModules) {
	const sharedModuleNameHash = getFileNameHash(sharedModule, "shared");
	const sharedModuleGlobalVariableName = `$${sharedModuleNameHash.substring(sharedModuleNameHash.length - 16)}`;
	sharedModuleEntries[sharedModule] = {
		import: path.resolve(SOURCE_DIR, "shared", sharedModule),
		filename: `shared/${sharedModuleNameHash}.js`,
		library: {
			name: sharedModuleGlobalVariableName,
			type: "var"
		}
	};
	sharedModuleExternals[`@/shared/${sharedModule}`] = sharedModuleGlobalVariableName;
}

const commonOptions = {
	mode: "production",
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"@": global.SOURCE_DIR
		}
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				options: {
					configFile: "config/tsconfig.json"
				}
			}
		]
	},
	optimization: {
		minimize: process.env.NODE_ENV === "production"
	},
	output: {
		iife: true
	}
};

const sharedModuleOptions = {
	externals: sharedModuleExternals,
	externalsType: "var",
	module: {
		rules: [
			{
				test: /\.(j|t)s$/,
				loader: path.resolve(CONFIG_DIR, "webpack/loader/count-imports-loader.js"),
				options: {
					sharedModulesImportedCount
				},
				enforce: "post"
			}
		]
	},
};

const uninjectedScriptConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: uninjectedScriptEntries,
		plugins: [
			new CopyPlugin({
				patterns: [{
					from: path.resolve(ROOT_DIR, "static"),
					to: "./"
				}]
			})
		]
	}
);

const injectedAfterScriptConfiguration = merge(
	commonOptions,
	{
		entry: injectedAfterScriptEntries,
		plugins: [
			new InjectScriptPlugin()
		]
	}
);

const injectedBeforeScriptConfiguration = merge(
	commonOptions,
	{
		entry: injectedBeforeScriptEntries,
		plugins: [
			new InjectScriptPlugin(true)
		]
	}
);

const sharedModulesConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: sharedModuleEntries,
		plugins: [
			new CreateManifestPlugin({
				sharedModulesImportedCount
			}),
			new CreateRulesPlugin()
		]
	}
);

module.exports = [
	uninjectedScriptConfiguration,
	injectedAfterScriptConfiguration,
	injectedBeforeScriptConfiguration,
	sharedModulesConfiguration
];
