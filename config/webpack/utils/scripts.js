const path = require("path");
const scripts = require(path.resolve(SOURCE_DIR, "scripts.json"));

const formattedScripts = {};

for (const scriptType in scripts) {
	const currentScripts = scripts[scriptType];
	for (const scriptName in currentScripts) {
		const scriptPath = currentScripts[scriptName];
		formattedScripts[scriptPath] = formattedScripts[scriptPath] || {};
		formattedScripts[scriptPath][scriptType] = formattedScripts[scriptPath][scriptType] || [];
		formattedScripts[scriptPath][scriptType].push(scriptName);
	}
}

module.exports = formattedScripts;
