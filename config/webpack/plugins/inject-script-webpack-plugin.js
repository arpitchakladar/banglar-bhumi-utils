const { sources } = require("webpack");
const terser = require("terser");

const propectualIndexOf = (string, characterList, start) => {
	if (start > 0) {
		let i = 0;
		let x = start;
		while (i < characterList.length) {
			x = string.indexOf(characterList[i], x + 1);
			if (x < 0) {
				return -1;
			}
			i++;
		}
		return x;
	} else {
		return -1;
	}
};

class InjectScriptPlugin {
	constructor({ onload, isFirst }) {
		this.onload = !!onload;
		this.isFirst = !!isFirst;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("InjectScriptPlugin", compilation => {
			compilation.hooks.processAssets.tapPromise(
				{
					name: "InjectScriptPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE,
					additionalAssets: true
				},
				async assets => {
					for (const assetName in assets) {
						if (assetName.endsWith(".js")) {
							let currentAssetContent = compilation.getAsset(assetName).source.source();
							let start = `
								const observer = new MutationObserver(mutations => {
								const script = document.querySelector("head > script:nth-child(54)");
								if (script) {
									script.innerHTML 
							`;
							let end = "";
							if (!this.isFirst) {
								start += "+";
							}
							start += "= `";
							if (this.onload) {
								start += "document.addEventListener(\"DOMContentLoaded\", () => {";
								end += "});";
							}
							end += `\`;
										observer.disconnect();
									}
								});
								observer.observe(document, {childList: true, subtree: true});
							`;
							const content = (await terser.minify(currentAssetContent.replaceAll("`", "\\`"))).code;
							compilation.updateAsset(
								assetName,
								new sources.RawSource(start + content + end)
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
