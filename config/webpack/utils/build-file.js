import crypto from "crypto";

/**
 * Generates a deterministic output filename for a module.
 * In production the result is a short MD5 hash; in development the
 * original name is preserved alongside the hash for easier debugging.
 *
 * @param {string} fileName   - The original module filename.
 * @param {string} prefix     - A namespace prefix (e.g. "shared", "injected").
 * @param {boolean} justHash  - When true, always return only the hash part.
 * @returns {string} The transformed filename.
 */
export const getFileName = (fileName, prefix, justHash = false) => {
	let hash = crypto
		.createHash("md5")
		.update(`${prefix}-${fileName}`)
		.digest("hex")
		.substring(16);

	if (production) {
		return hash;
	} else {
		if (justHash) {
			return hash;
		} else {
			return `${fileName}-${hash}`;
		}
	}
};
