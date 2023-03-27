const { ImportManager } = require("import-manager");
const { getFileNameHash } = webpackRequire("utils/file-name-hash");

const sharedModules = webpackRequire("utils/shared-modules.js");

module.exports = source => {
	const manager = new ImportManager(source);
	let modified = false;

	for (const unit of manager.imports.es6.units) {
		const moduleIndex = sharedModules.indexOf(unit.module.name);

		if (moduleIndex >= 0 && unit.type === "es6") {
			const importedModuleNames = unit.members.entities
				.map(entity => `\t${entity.name}`)
				.concat(unit.defaultMembers.entities.map(entity => `\tdefault: ${entity.name}`))
				.join(",\n");

			const importStatement = `const {\n${importedModuleNames}\n} = await import(/* webpackIgnore: true */ "/shared/${getFileNameHash(sharedModules[moduleIndex], "shared")}.js");\n`;

			unit.methods = {
				makeUntraceable() {}
			};
			manager.remove(unit);
			manager.insertStatement(importStatement, "bottom", "dynamic");
			modified = true;
		}
	}

	return modified ? manager.code.toString() + "\nexport {};" : source;
};
