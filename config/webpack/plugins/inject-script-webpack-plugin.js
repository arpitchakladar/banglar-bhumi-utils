const terser = require("terser");

let count = 0;

class InjectScriptPlugin {
	constructor({ onload }) {
		this.onload = !!onload;
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
							let x = 2;
							for (let i = 0; i < content.length; i++) {
								if (typeof content[i] === "string" && content[i].indexOf("__webpack_exports__") >= 0) {
									x = i;
									break;
								}
							}
							content[x] += `
								const observer = new MutationObserver(mutations => {
								const script = document.querySelector("head > script:nth-child(54)");
								if (script) {
							`
							if (count > 0) {
								content[x] += "script.innerHTML += `";
							} else {
								content[x] += "script.innerHTML = `";
							}
							if (this.onload) {
								content[x] += "document.addEventListener(\"DOMContentLoaded\", () => {";
								content[content.length - 3] += "});";
							}
							content[content.length - 3] += "`;observer.disconnect();}});observer.observe(document, {childList: true, subtree: true});";
							content[x + 1] = (await terser.minify(content[x + 1]._source._source._valueAsString.replaceAll("`", "\\`"))).code;
							count++;
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
