const path = require("path");

const scripts = require(path.resolve(SOURCE_DIR, "scripts.json"));

const getScriptType = scriptName => {
	for (const scriptType in scripts) {
		if (scripts[scriptType][scriptName]) {
			return scriptType;
		}
	}
	return "undefined_script";
};

module.exports = function (source) {
	return `/*<--\t${getScriptType(this.resourcePath.replace(path.resolve(SOURCE_DIR, "scripts") + "/", ""))}\t-->*/
(() => {\n${source}\n})();
/*<---->*/`
};
