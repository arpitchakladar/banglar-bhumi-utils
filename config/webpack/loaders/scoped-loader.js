const path = require("path");

const scripts = require(path.resolve(process.env.SOURCE_DIR, "scripts.json"));

const getScriptType = scriptName => {
	for (const scriptType in scripts) {
		if (scripts[scriptType][scriptName]) {
			return scriptType;
		}
	}
	return "undefined_script";
};

module.exports = function (source) {
	return `/*<--\t${getScriptType(path.basename(this.resourcePath))}\t-->*/
(() => {\n${source}\n})();
/*<---->*/`
};
