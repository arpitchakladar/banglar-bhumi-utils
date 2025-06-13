import { ImportManager } from "import-manager";
import sharedModules from "../utils/shared-modules.js";

export default function(source) {
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
