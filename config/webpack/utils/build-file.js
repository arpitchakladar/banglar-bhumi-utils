const crypto = require("crypto");

module.exports.getFileName = (fileName, prefix, justHash = false) => {
	let hash = crypto
		.createHash("md5")
		.update(`${prefix}-${fileName}`)
		.digest("hex");

	if (production) {
		return hash;
	} else {
		hash = hash.substring(16);
		if (justHash) {
			return hash;
		} else {
			return `${fileName}-${hash}`;
		}
	}
};
