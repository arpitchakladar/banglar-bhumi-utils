import crypto from "crypto";

/**
 * Computes an MD5 hash suffix (last 16 hex characters) for a given URL.
 * Used to create unique attribute names for injected script data.
 *
 * @param {string} url - The URL to hash.
 * @returns {string} A 16-character hex hash.
 */
const getHash = (url) =>
	crypto
		.createHash("md5")
		.update(url)
		.digest("hex")
		.substring(16);

/**
 * Transforms extension asset URL placeholders (`"$l{ url }l$"`) in the
 * compiled JavaScript into `document.currentScript.getAttribute("data-<hash>")`
 * lookups.  The mapping of hashes to resolved `chrome.runtime.getURL()` calls
 * is returned separately so the injector script can embed it as data attributes.
 *
 * @param {string} code - The compiled JavaScript bundle.
 * @returns {[string, string]} A tuple of [transformedCode, extensionAssetsJSON].
 */
export function getInjectedCode(code) {
	const extensionAssets = {};
	let i = 0;

	while (true) {
		i = code.indexOf("\"$l{", i);

		if (i < 0) {
			break;
		}

		const start = i;
		const end = code.indexOf("}l$\"", i);

		if (end <= 0) {
			break;
		}

		const url = code.substring(start + 4, end).trim();
		const urlHash = getHash(url);
		code = code.substring(0, start) + `document.currentScript.getAttribute("data-${urlHash}")` + code.substring(end + 4);
		extensionAssets[urlHash] = url;

		i = end + 4;
	}

	const extensionAssetsCode = Object.entries(extensionAssets).map(
		(asset) => `"${asset[0]}": chrome.runtime.getURL("${asset[1]}")`
	).join(",");

	return [code, `{${extensionAssetsCode}}`];
};
