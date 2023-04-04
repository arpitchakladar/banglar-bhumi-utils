const path = require("path");

const { ImportManager } = require("import-manager");

const sharedModules = webpackRequire("utils/shared-modules.js");

module.exports = function(source) {
	const { sortedSharedModules } = this.getOptions();
	const manager = new ImportManager(source);

	for (const unit of manager.imports.es6.units) {
		const moduleIndex = sharedModules.indexOf(unit.module.name);

		if (moduleIndex >= 0) {
			const currentSharedModuleName = sharedModules[moduleIndex];

			if (!sortedSharedModules.includes(currentSharedModuleName)) {
				sortedSharedModules.push(currentSharedModuleName);
			}
		}
	}

	sortedSharedModules.push(path.basename(this.resourcePath.substring(0, this.resourcePath.length - 3)));

	return source;
};
