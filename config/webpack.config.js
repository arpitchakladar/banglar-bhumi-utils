const path = require("path");
const fs = require("fs");
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

const scripts = webpackRequire("utils/scripts");

const sharedModules = webpackRequire("utils/shared-modules");

const uninjectedScriptEntries = {};
const injectedScriptEntries = {};
const sharedModuleEntries = {};
const sharedModuleExternals = {};

for (const scriptPath in scripts) {
	for (const scriptType in scripts[scriptPath]) {
		const currentScripts = scripts[scriptPath][scriptType];
		const scriptEntries = scriptType.startsWith("injected") ? injectedScriptEntries : uninjectedScriptEntries;

		scriptEntries[`${scriptType} - "${scriptPath}"`] = {
			import: inlineJavascript(currentScripts.map(script => `import "${path.resolve(SOURCE_DIR, "scripts", script)}";`).join("\n")),
			filename: `scripts/${getFileNameHash(scriptPath)}-${scriptType}.js`
		};
	}
}

for (const sharedModule of sharedModules) {
	sharedModuleEntries[sharedModule] = {
		import: path.resolve(SOURCE_DIR, "shared", sharedModule),
		filename: `shared/${sharedModule}.js`,
		library: {
			type: "module"
		}
	};
	sharedModuleExternals[`/shared/${sharedModule}`] = `/shared/${sharedModule}.js`;
}

const common = {
	mode: "production",
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			"/shared": path.resolve(global.SOURCE_DIR, "shared")
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
	}
};

module.exports = [
	{
		...common,
		experiments: {
			outputModule: true,
			topLevelAwait: true
		},
		externals: sharedModuleExternals,
		entry: uninjectedScriptEntries,
		plugins: [
			new CopyPlugin({
				patterns: [{
					from: path.resolve(ROOT_DIR, "static"),
					to: "./"
				}]
			}),
			new CreateManifestPlugin()
		]
	},
	{
		...common,
		entry: injectedScriptEntries,
		plugins: [
			new InjectScriptPlugin(),
		]
	},
	{
		...common,
		externals: sharedModuleExternals,
		experiments: {
			outputModule: true,
			topLevelAwait: true
		},
		entry: sharedModuleEntries
	}
];
