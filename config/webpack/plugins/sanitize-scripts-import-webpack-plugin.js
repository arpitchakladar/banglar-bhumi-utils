const { sources } = require("webpack");

const perpectualIndexOf = (string, characterList, start) => {
	if (start > 0) {
		let x = start;
		for (let i = 0; i < characterList.length; i++) {
			x = string.indexOf(characterList[i], x + 1);
			if (x < 0) {
				return -1;
			}
		}
		return x;
	} else {
		return -1;
	}
};

class SanitizeScriptsImportPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("SanitizeScriptsImportPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "SanitizeScriptsImportPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
					additionalAssets: true
				},
				assets => {
					for (const assetName in assets) {
						if (assetName.endsWith(".js")) {
							const currentAssetContent = compilation.getAsset(assetName).source.source();
							let previouslyEnded = 0;
							let code = "";
							while (true) {
								const start = perpectualIndexOf(currentAssetContent, ["\n/***/", "\n/***/", "\n"], previouslyEnded + 1);
								previouslyEnded = perpectualIndexOf(currentAssetContent, ["\n/***/"], start + 1);
								if (previouslyEnded < 0) {
									break;
								} else {
									code += currentAssetContent.substring(start, previouslyEnded);
								}
							}
							compilation.updateAsset(
								assetName,
								new sources.RawSource(code)
							);
						}
					}
				}
			);
		});
	}
}

module.exports = SanitizeScriptsImportPlugin;