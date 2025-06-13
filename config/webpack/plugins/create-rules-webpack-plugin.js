import path from "path";
import fs from "fs";
import webpack from "webpack";

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
						const rule = JSON.parse(fs.readFileSync(path.resolve("src/rules", ruleFileName)));

						if (rule instanceof Array) {
							for (const currentRule of rule) {
								currentRule.id = ruleId++;
								rules.push(currentRule);
							}
						} else {
							rule.id = ruleId++;
							rules.push(rule);
						}
					}

					compilation.emitAsset(
						"rules.json",
						new webpack.sources.RawSource(
							JSON.stringify(
								rules,
								undefined,
								process.env.NODE_ENV === "production"
									? undefined
									: "\t"
							)
						)
					);
				}
			);
		});
	}
}

export default CreateRulesPlugin;
