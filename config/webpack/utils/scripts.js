import path from "path";
import fs from "fs";

/**
 * Reads `src/scripts.json` and re-indexes it so the outer key is the
 * URL path fragment and the inner key is the script type.  This makes it
 * trivial to look up which scripts run on which page.
 *
 * @returns {Record<string, Record<string, string[]>>} e.g.
 *   `{ "*": { "injected": ["stop-blocking.ts"] }, "MuteApplication.action": … }`
 */
const scripts = JSON.parse(
	fs.readFileSync(
		path.resolve("./src/scripts.json"),
	),
);

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

export default formattedScripts;
