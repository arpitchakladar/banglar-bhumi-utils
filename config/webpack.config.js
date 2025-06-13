import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import webpack from "webpack";
import { merge } from "webpack-merge";
import CopyPlugin from "copy-webpack-plugin";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

global.ROOT_DIR = path.resolve(__dirname, "..");
global.CONFIG_DIR = path.resolve(ROOT_DIR, "config");
global.SOURCE_DIR = path.resolve(ROOT_DIR, "src");
global.production = process.env.NODE_ENV === "production";

import CreateManifestPlugin from "./webpack/plugins/create-manifest-webpack-plugin/index.js";
import CreateRulesPlugin from "./webpack/plugins/create-rules-webpack-plugin.js";
import InjectScriptPlugin from "./webpack/plugins/inject-script-webpack-plugin.js";
import CreateInjectedSharedModulesPlugin from "./webpack/plugins/create-injected-shared-modules-webpack-plugin.js";

import { inlineJavascript } from "./webpack/utils/inline-javascript.js";
import { getScriptRuntimeFromType } from "./webpack/utils/script-runtime.js";
import { getFileName } from "./webpack/utils/build-file.js";

import scripts from "./webpack/utils/scripts.js";
import sharedModules from "./webpack/utils/shared-modules.js";

const sharedModulesImportedCount = {};

for (const sharedModule of sharedModules) {
	sharedModulesImportedCount[sharedModule] = 0;
}

const injectedSharedModulesImportedCount = {};

for (const sharedModule of sharedModules) {
	injectedSharedModulesImportedCount[sharedModule] = 0;
}

const backgroundScriptEntries = {};
const uninjectedScriptEntries = {};
const injectedAfterScriptEntries = {};
const injectedBeforeScriptEntries = {};
const sharedModuleEntries = {};
const sharedModuleExternals = {};

const backgroundScriptImports = fs.readdirSync(path.resolve(SOURCE_DIR, "background"))
	.map(scriptName => `import "${path.resolve(SOURCE_DIR, "background", scriptName)}";`)
	.join("\n");
backgroundScriptEntries["background script"] = {
	import: inlineJavascript(backgroundScriptImports),
	filename: "background.js"
};

for (const scriptPath in scripts) {
	for (const scriptType in scripts[scriptPath]) {
		const currentScripts = scripts[scriptPath][scriptType];
		let scriptEntries;
		let destinationFolder = "scripts";

		switch (scriptType) {
		case "injected":
			scriptEntries = injectedAfterScriptEntries;
			destinationFolder = "scripts/injected";
			break;

		default:
			scriptEntries = uninjectedScriptEntries;
		}

		scriptEntries[`${scriptType} - "${scriptPath}"`] = {
			import: inlineJavascript(currentScripts.map(script => `import "${path.resolve(SOURCE_DIR, "scripts", script)}";`).join("\n")),
			filename: `${destinationFolder}/${getFileName(scriptType, scriptPath)}.js`
		};
	}
}

for (const sharedModule of sharedModules) {
	const sharedModuleNameHash = getFileName(sharedModule, "shared");
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
		extensions: [".ts", ".js", ".html"],
		alias: {
			"@": global.SOURCE_DIR,
		},
	},
	module: {
		rules: [
			{
				test: /\.ts$/,
				loader: "ts-loader",
				options: {
					configFile: "config/tsconfig.json",
				}
			},
			{
				test: /\.html$/,
				loader: path.resolve(CONFIG_DIR, "webpack/loader/to-string-loader.js"),
			},
		],
	},
	optimization: {
		minimize: process.env.NODE_ENV === "production",
		runtimeChunk: false,
	},
	output: {
		iife: true,
	},
	plugins: [
		new webpack.optimize.LimitChunkCountPlugin({
			maxChunks: 1,
		}),
	],
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
					sharedModulesImportedCount,
				},
				enforce: "post",
			}
		]
	}
};

const backgroundScriptConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: backgroundScriptEntries,
	},
);

const uninjectedScriptConfiguration = merge(
	commonOptions,
	sharedModuleOptions,
	{
		entry: uninjectedScriptEntries
	}
);

const injectedScriptConfiguration = merge(
	commonOptions,
	{
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
		},
		entry: injectedAfterScriptEntries,
		plugins: [
			new InjectScriptPlugin()
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

export default [
	backgroundScriptConfiguration,
	uninjectedScriptConfiguration,
	injectedScriptConfiguration,
	sharedModulesConfiguration
];
