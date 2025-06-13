import path from "path";
import fs from "fs";

export default fs.readdirSync(path.resolve("src/shared"))
	.filter(sharedModule => !sharedModule.endsWith("import-shared.js"))
	.map(sharedModule => sharedModule.substring(0, sharedModule.length - 3));
