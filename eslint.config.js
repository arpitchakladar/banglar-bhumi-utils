import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import importX from "eslint-plugin-import-x";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
	{
		ignores: [
			"**/dist/**",
			"**/node_modules/**",
			"**/*.wasm.js",
			"**/static/**"
		]
	},

	js.configs.recommended,

	...tseslint.configs.strictTypeChecked,
	...tseslint.configs.stylisticTypeChecked,

	stylistic.configs.recommended,

	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.webextensions
			},
			parserOptions: {
				projectService: true,
				tsconfigRootDir: import.meta.dirname
			}
		},

		plugins: {
			"import-x": importX
		},

		rules: {
			"@stylistic/indent": ["error", "tab"],
			"@stylistic/quotes": ["error", "double"],
			"@stylistic/semi": ["error", "always"],
			"@stylistic/comma-dangle": ["error", "never"],
			"@stylistic/max-len": ["warn", { code: 120, ignoreUrls: true, ignoreStrings: true, ignoreTemplateLiterals: true }],
			"@stylistic/arrow-parens": ["error", "always"],
			"@stylistic/brace-style": ["error", "1tbs", { allowSingleLine: true }],
			"@stylistic/no-multiple-empty-lines": ["error", { max: 1, maxEOF: 1 }],
			"@stylistic/no-trailing-spaces": "error",
			"@stylistic/eol-last": ["error", "always"],
			"@stylistic/no-tabs": "off",
			"@stylistic/space-before-function-paren": ["error", "never"],
			"@stylistic/member-delimiter-style": ["error", { multiline: { delimiter: "semi", requireLast: false }, singleline: { delimiter: "semi", requireLast: false } }],

			"@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_", destructuredArrayIgnorePattern: "^_" }],
			"@typescript-eslint/explicit-function-return-type": ["warn", { allowExpressions: true, allowTypedFunctionExpressions: true }],
			"@typescript-eslint/no-explicit-any": "error",
			"@typescript-eslint/prefer-readonly": "warn",
			"@typescript-eslint/consistent-type-definitions": ["error", "type"],
			"@typescript-eslint/method-signature-style": ["error", "property"],

			"no-console": "warn",
			"no-alert": "error",

			"import-x/order": ["error", {
				"groups": ["builtin", "external", "internal", ["parent", "sibling"], "index"],
				"newlines-between": "always",
				"alphabetize": { order: "asc", orderImportKind: "asc" }
			}],
			"import-x/no-duplicates": "error",
			"import-x/first": "error",
			"import-x/newline-after-import": "error"
		}
	},

	{
		files: ["**/*.js"],
		...tseslint.configs.disableTypeChecked,
		rules: {
			...tseslint.configs.disableTypeChecked.rules,
			"@typescript-eslint/explicit-function-return-type": "off"
		}
	},

	{
		files: ["webpack.config.js", "config/**/*.js"],
		...tseslint.configs.disableTypeChecked,
		languageOptions: {
			globals: {
				...globals.node,
				ROOT_DIR: "writable",
				CONFIG_DIR: "writable",
				SOURCE_DIR: "writable",
				production: "writable"
			}
		},
		rules: {
			...tseslint.configs.disableTypeChecked.rules,
			"no-console": "off",
			"@typescript-eslint/explicit-function-return-type": "off"
		}
	}
);
