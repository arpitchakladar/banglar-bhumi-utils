import path from "path";
import fs from "fs";

/**
 * Scans `src/shared/` and returns the list of shared module filenames
 * (with the `.ts` extension stripped), excluding `import-shared.js`.
 *
 * @returns {string[]} e.g. `["generate-web-page", "intercept-jquery-ajax", …]`
 */
export default fs.readdirSync(path.resolve("src/shared"))
	.filter(sharedModule => !sharedModule.endsWith("import-shared.js"))
	.map(sharedModule => sharedModule.substring(0, sharedModule.length - 3));
