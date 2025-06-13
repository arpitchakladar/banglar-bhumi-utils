import path from "path";
import { ImportManager } from "import-manager";

import sharedModules from "../utils/shared-modules.js";

export default function(source) {
	const currentSharedModuleName = path.basename(this.resourcePath.substring(0, this.resourcePath.length - 3));

	if (sharedModules.includes(currentSharedModuleName)) {
		const { sortedSharedModules } = this.getOptions();
		const manager = new ImportManager(source);
		const modulesToBeIncluded = [];

		for (const unit of manager.imports.es6.units) {
			const moduleIndex = sharedModules.indexOf(unit.module.name);

			if (moduleIndex >= 0) {
				const currentSharedModuleName = sharedModules[moduleIndex];

				if (!(sortedSharedModules.includes(currentSharedModuleName) || modulesToBeIncluded.includes(currentSharedModuleName))) {
					modulesToBeIncluded.push(currentSharedModuleName);
				}
			}
		}

		const currentModuleIndex = sortedSharedModules.indexOf(currentSharedModuleName);

		if (currentModuleIndex >= 0) {
			for (const sharedModule of modulesToBeIncluded) {
				sortedSharedModules.splice(currentModuleIndex, 0, sharedModule);
			}
		} else {
			for (const sharedModule of modulesToBeIncluded) {
				sortedSharedModules.push(sharedModule);
			}

			sortedSharedModules.push(currentSharedModuleName);
		}
	}

	return source;
};
