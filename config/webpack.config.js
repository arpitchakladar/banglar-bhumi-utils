const path = require("path");
const fs = require("fs");
const webpack = require("webpack");
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
const CreateInjectedSharedModulesPlugin = webpackRequire("plugins/create-injected-shared-modules-webpack-plugin");

const { inlineJavascript } = webpackRequire("utils/inline-javascript");
const { getScriptRuntimeFromType } = webpackRequire("utils/script-runtime");
const { getFileNameHash } = webpackRequire("utils/filename-hash");

const scripts = webpackRequire("utils/scripts");
const sharedModules = webpackRequire("utils/shared-modules");

const sharedModulesImportedCount = {};

for (const sharedModule of sharedModules) {
	sharedModulesImportedCount[sharedModule] = 0;
}

const injectedSharedModulesImportedCount = {};

for (const sharedModule of sharedModules) {
	injectedSharedModulesImportedCount[sharedModule] = 0;
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
	target: "web",
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
		minimize: process.env.NODE_ENV === "production",
		runtimeChunk: false
	},
	output: {
		iife: true
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1
		})
	]
};

const sharedModuleOptions = {
	externals: sharedModuleExternals,
	externalsType: "var",
	module: {
		rules: [
			{
				test: /banglar-bhumi-utils\/src\/.*.(^.?|\.[^d]|[^.]d|[^.][^d])\.(t|j)s$/,
				loader: path.resolve(CONFIG_DIR, "webpack/loader/count-imports-loader.js"),
				options: {
					sharedModulesImportedCount
				},
				enforce: "post"
			}
		]
	}
};

const injectedModulesOptions = {
	externals: sharedModuleExternals,
	externalsType: "var",
	module: {
		rules: [
			{
				test: /banglar-bhumi-utils\/src\/.*.(^.?|\.[^d]|[^.]d|[^.][^d])\.(t|j)s$/,
				loader: path.resolve(CONFIG_DIR, "webpack/loader/count-imports-loader.js"),
				options: {
					sharedModulesImportedCount: injectedSharedModulesImportedCount
				},
				enforce: "post"
			}
		]
	}
};

const uninjectedScriptConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: uninjectedScriptEntries
	}
);

const injectedAfterScriptConfiguration = merge(
	commonOptions,
	injectedModulesOptions,
	{
		entry: injectedAfterScriptEntries,
		plugins: [
			new InjectScriptPlugin()
		]
	}
);

const injectedBeforeScriptConfiguration = merge(
	commonOptions,
	injectedModulesOptions,
	{
		entry: injectedBeforeScriptEntries,
		plugins: [
			new InjectScriptPlugin(true)
		]
	}
);

const sortedSharedModules = []

const sharedModulesConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: sharedModuleEntries,
		plugins: [
			new CopyPlugin({
				patterns: [{
					from: path.resolve(ROOT_DIR, "static"),
					to: "./"
				}]
			}),
			new CreateInjectedSharedModulesPlugin({
				injectedSharedModulesImportedCount,
				sortedSharedModules
			}),
			new CreateRulesPlugin(),
			new CreateManifestPlugin({
				sharedModulesImportedCount,
				injectedSharedModulesImportedCount,
				sortedSharedModules
			})
		],
		module: {
			rules: [
				{
					test: /banglar-bhumi-utils\/src\/.*.(^.?|\.[^d]|[^.]d|[^.][^d])\.(t|j)s$/,
					loader: path.resolve(CONFIG_DIR, "webpack/loader/arrange-shared-module-loader.js"),
					options: {
						sortedSharedModules
					},
					enforce: "post"
				}
			]
		}
	}
);

module.exports = [
	uninjectedScriptConfiguration,
	injectedAfterScriptConfiguration,
	injectedBeforeScriptConfiguration,
	sharedModulesConfiguration
];
