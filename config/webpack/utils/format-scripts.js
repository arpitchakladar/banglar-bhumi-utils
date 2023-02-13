module.exports.formatScripts = scripts => {
	const _scripts = {};

	for (const scriptType in scripts) {
		const currentScripts = scripts[scriptType];
		for (const scriptName in currentScripts) {
			const scriptPath = currentScripts[scriptName];
			_scripts[scriptPath] = _scripts[scriptPath] || {};
			_scripts[scriptPath][scriptType] = _scripts[scriptPath][scriptType] || [];
			_scripts[scriptPath][scriptType].push(scriptName);
		}
	}



	return _scripts;
};
