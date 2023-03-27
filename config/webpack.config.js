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
	const sharedModuleNameHash = getFileNameHash(sharedModule);
	sharedModuleEntries[sharedModule] = {
		import: path.resolve(SOURCE_DIR, "shared", sharedModule),
		filename: `shared/${sharedModuleNameHash}.js`
	};
	sharedModuleExternals[`@/shared/${sharedModule}`] = `/shared/${sharedModuleNameHash}.js`;
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
	}
};

const ecmaScriptModuleOptions = {
	experiments: {
		outputModule: true,
		topLevelAwait: true
	}
};

const uninjectedScriptConfiguration = {
	...commonOptions,
	...ecmaScriptModuleOptions,
	entry: uninjectedScriptEntries,
	plugins: [
		new CopyPlugin({
			patterns: [{
				from: path.resolve(ROOT_DIR, "static"),
				to: "./"
			}]
		}),
		new CreateManifestPlugin()
	],
	module: {
		rules: [
			{
				test: /\.(js|ts)$/,
				loader: "./config/webpack/loader/dynamic-imports-loader"
			},
			...commonOptions.module.rules
		]
	}
};

const injectedScriptConfiguration = {
	...commonOptions,
	entry: injectedScriptEntries,
	plugins: [
		new InjectScriptPlugin(),
	]
};

const sharedModulesConfiguration = {
	...commonOptions,
	...ecmaScriptModuleOptions,
	output: {
		library: {
			type: "module"
		}
	},
	entry: sharedModuleEntries,
	externals: sharedModuleExternals
};

module.exports = [
	uninjectedScriptConfiguration,
	injectedScriptConfiguration,
	sharedModulesConfiguration
];
