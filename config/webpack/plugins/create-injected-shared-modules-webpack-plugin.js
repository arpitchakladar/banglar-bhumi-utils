const path = require("path");
const fs = require("fs");
const { sources } = require("webpack");

const { getFileNameHash } = webpackRequire("utils/filename-hash");

class CreateInjectedSharedModulesPlugin {
	constructor({ injectedSharedModulesImportedCount, sortedSharedModules }) {
		this.injectedSharedModulesImportedCount = injectedSharedModulesImportedCount;
		this.sortedSharedModules = sortedSharedModules;
	}

	apply(compiler) {
		compiler.hooks.compilation.tap("CreateInjectedSharedModulesPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateInjectedSharedModulesPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				},
				assets => {
					const injectedSharedScripts = this.sortedSharedModules
						.filter(sharedModule => this.injectedSharedModulesImportedCount[sharedModule] > 0)
						.map(sharedModule => `"/shared/${getFileNameHash(sharedModule, "shared")}.js"`);

					if (injectedSharedScripts.length > 0) {
						const injectionCode = `(async()=>{let e=(await Promise.all([${injectedSharedScripts.join(", ")}].map(async e=>(await fetch(chrome.runtime.getURL(e))).text()))).join(""),t=new MutationObserver(()=>{let n=document.querySelector("head > script:nth-child(54)");n&&(n.innerHTML=e+n.innerHTML,t.disconnect())});t.observe(document,{childList:!0,subtree:!0})})();`;
						compilation.emitAsset(
							`shared/${getFileNameHash("injected-shared-modules", "shared")}.js`,
							new sources.RawSource(injectionCode)
						);
					}
				}
			);
		});
	}
}

module.exports = CreateInjectedSharedModulesPlugin;
