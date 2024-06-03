const crypto = require("crypto");

module.exports.getFileName = (fileName, prefix, justHash = false) => {
	let hash = crypto
		.createHash("md5")
		.update(`${prefix}-${fileName}`)
		.digest("hex").substring(16);

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
