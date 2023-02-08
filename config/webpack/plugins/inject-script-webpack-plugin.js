const { sources } = require("webpack");
const terser = require("terser");

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
							let start = `(() => {
								const o = new MutationObserver(() => {
								const s = document.querySelector("head > script:nth-child(54)");
								if (s) {
									s.innerHTML 
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
										o.disconnect();
									}
								});
								o.observe(document, {childList: true, subtree: true});
							})();`;
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
