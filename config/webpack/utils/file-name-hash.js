const crypto = require("crypto");

module.exports.getFileNameHash = fileName => crypto.createHash("md5").update(fileName).digest("hex").substring(16);
