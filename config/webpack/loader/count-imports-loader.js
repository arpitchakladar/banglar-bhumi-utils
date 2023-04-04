const { ImportManager } = require("import-manager");

const sharedModules = webpackRequire("utils/shared-modules.js");

module.exports = function(source) {
	const { sharedModulesImportedCount } = this.getOptions();
	const manager = new ImportManager(source);

	for (const unit of manager.imports.es6.units) {
		const moduleIndex = sharedModules.indexOf(unit.module.name);

		if (moduleIndex >= 0) {
			sharedModulesImportedCount[sharedModules[moduleIndex]]++;
		}
	}

	return source;
};
