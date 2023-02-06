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
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_OPTIMIZE_SIZE,
					additionalAssets: true
				},
				async assets => {
					for (const assetName in assets) {
						if (assetName.endsWith(".js")) {
							const asset = assets[assetName];
							let content = asset._source._children;
							let x = -1;
							for (let i = 0; i < content.length; i++) {
								if (typeof content[i] === "string" && content[i].indexOf("__webpack_exports__") >= 0) {
									x = i;
									break;
								}
							}
							if (x == -1) {
								throw Error("Failed to inject script.");
							}
							content[x] += `
								const observer = new MutationObserver(mutations => {
								const script = document.querySelector("head > script:nth-child(54)");
								if (script) {
									script.innerHTML 
							`;
							if (!this.isFirst) {
								content[x] += "+";
							}
							content[x] += "= `";
							if (this.onload) {
								content[x] += "document.addEventListener(\"DOMContentLoaded\", () => {";
								content[content.length - 3] += "});";
							}
							content[content.length - 3] += `\`;
										observer.disconnect();
									}
								});
								observer.observe(document, {childList: true, subtree: true});
							`;
							content[x + 1] = (await terser.minify(content[x + 1]._source._source._valueAsString.replaceAll("`", "\\`"))).code;
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
