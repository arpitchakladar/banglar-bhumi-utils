const crypto = require("crypto");

module.exports.getFileNameHash = (fileName, prefix) => {
	const finalFileName = `${prefix}-${fileName}`;
	const hash = crypto
		.createHash("md5")
		.update(finalFileName)
		.digest("hex");

	return production ? hash : `${fileName}-${hash.substring(16)}`;
};
