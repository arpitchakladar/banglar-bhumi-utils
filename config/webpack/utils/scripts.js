import path from "path";
import fs from "fs";

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
