const path = require("path");
const fs = require("fs");
const { sources } = require("webpack");

class CreateRulesPlugin {
	apply(compiler) {
		compiler.hooks.compilation.tap("CreateRulesPlugin", compilation => {
			compilation.hooks.processAssets.tap(
				{
					name: "CreateRulesPlugin",
					stage: compiler.webpack.Compilation.PROCESS_ASSETS_STAGE_ADDITIONAL
				},
				assets => {
					const ruleFileNames = fs.readdirSync(path.resolve(SOURCE_DIR, "rules"));
					const rules = [];
					let ruleId = 1;

					for (const ruleFileName of ruleFileNames) {
						const rule = require(path.resolve(SOURCE_DIR, "rules", ruleFileName));

						if (rule instanceof Array) {
							for (const rule of rule) {
								rule.id = ruleId++;
								rules.push(rule);
							}
						} else {
							rule.id = ruleId++;
							rules.push(rule);
						}
					}

					compilation.emitAsset(
						"rules.json",
						new sources.RawSource(JSON.stringify(rules, undefined, process.env.NODE_ENV === "production" ? undefined : "\t"))
					);
				}
			);
		});
	}
}

module.exports = CreateRulesPlugin;
