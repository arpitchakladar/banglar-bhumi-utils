const path = require("path");
const fs = require("fs");

const sharedModules = fs.readdirSync(path.resolve(SOURCE_DIR, "shared"))
	.filter(sharedModule => !sharedModule.endsWith("import-shared.js"))
	.map(sharedModule => sharedModule.substring(0, sharedModule.length - 3));4

module.exports = sharedModules;
