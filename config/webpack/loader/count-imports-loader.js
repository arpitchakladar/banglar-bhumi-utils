import { ImportManager } from "import-manager";
import sharedModules from "../utils/shared-modules.js";

/**
 * Webpack loader that counts how many times each shared module is imported.
 * This count is used later to determine which shared modules need to be
 * included in the compiled output.
 *
 * @param {string} source - The source code of the current module.
 * @returns {string} The unmodified source (this loader is side-effect only).
 */
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
