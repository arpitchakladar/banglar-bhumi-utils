const crypto = require("crypto");

const getHash = url =>
	crypto
		.createHash("md5")
		.update(url)
		.digest("hex")
		.substring(16);

module.exports.getInjectedCode = code => {
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
		asset => `"${asset[0]}": chrome.runtime.getURL("${asset[1]}")`
	).join(",");

	return [code, `{${extensionAssetsCode}}`];
};
