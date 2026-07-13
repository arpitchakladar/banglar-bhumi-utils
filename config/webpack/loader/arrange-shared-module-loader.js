import path from "path";
import { ImportManager } from "import-manager";

import sharedModules from "../utils/shared-modules.js";

/**
 * Webpack loader that arranges shared modules in dependency order.
 * As each shared module is processed, its own shared-module dependencies
 * are inserted before it in the global `sortedSharedModules` array so that
 * the final output respects the import graph.
 *
 * @param {string} source - The source code of the current module.
 * @returns {string} The unmodified source (this loader is side-effect only).
 */
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
