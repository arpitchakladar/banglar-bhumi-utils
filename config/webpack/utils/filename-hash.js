const crypto = require("crypto");

module.exports.getFileNameHash = (fileName, prefix) => {
	const hash = crypto
		.createHash("md5")
		.update(`${prefix}-${fileName}`)
		.digest("hex");

	return production ? hash : `${fileName}-${hash.substring(16)}`;
};
