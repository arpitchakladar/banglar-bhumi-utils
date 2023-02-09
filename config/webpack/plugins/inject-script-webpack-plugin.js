const { sources } = require("webpack");
const terser = require("terser");

const getScriptCodeScoped = (scriptCode, loaded) => scriptCode
	? (loaded
		? `document.addEventListener(\"DOMContentLoaded\", () => {${scriptCode}});`
		: `(() => {${scriptCode}})();`)
	: "";

class InjectScriptPlugin {
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
							let scriptEnd = 0;
							const currentAssetContent = compilation.getAsset(assetName).source.source();
							const scripts = {
								before: "",
								injected: "",
								injected_and_loaded: ""
							};
							while (true) {
								const start = currentAssetContent.indexOf("/*<--\t", scriptEnd + 1);
								if (start < 0) {
									break;
								} else {
									const end = currentAssetContent.indexOf("\t-->*/", start + 1);
									if (end < 0) {
										throw Error("Failed to parse some scripts");
									} else {
										const scriptType = currentAssetContent.substring(start + 6, end);
										scriptEnd = currentAssetContent.indexOf("\n/*<---->*/", end + 1)
										if (scriptEnd < 0) {
											break;
										}
										scripts[scriptType.trim()] += currentAssetContent.substring(end + 6, scriptEnd);
										scriptEnd += 11;
									}
								}
							}
							for (const scriptType in scripts) {
								const currentScriptCode = (await terser.minify(scripts[scriptType].replaceAll("`", "\\`"))).code;
								scripts[scriptType] = currentScriptCode
									? (scriptType === "injected_and_loaded"
										? `document.addEventListener(\"DOMContentLoaded\", () => {${currentScriptCode}});`
										: `(() => {${currentScriptCode}})();`)
									: "";
							}
							const injectedCode = (scripts.injected || scripts.injected_and_loaded)
								? `const o = new MutationObserver(() => {
									const s = document.querySelector("head > script:nth-child(54)");
									if (s) {
										s.innerHTML = \`${scripts.injected}${scripts.injected_and_loaded}\`;
										o.disconnect();
									}
								});
								o.observe(document, {childList: true, subtree: true});`
								: "";
							const resultantCode = scripts.before + injectedCode;
							compilation.updateAsset(
								assetName,
								new sources.RawSource(resultantCode)
							);
						}
					}
				}
			);
		});
	}
}

module.exports = InjectScriptPlugin;
