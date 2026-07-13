/**
 * Webpack loader that converts HTML template files into JavaScript modules.
 * It escapes template literals and replaces `$name$` placeholders with
 * `${name}` interpolation syntax so the exported function can accept a
 * replacements object.
 *
 * @param {string} source - Raw HTML file content.
 * @returns {string} A JS module that exports a function accepting
 *   replacement values and returning the interpolated HTML string.
 */
export default function(source) {
	source = source
		.replaceAll("\\", "\\\\")
		.replaceAll("`","\\`")
		.replaceAll("${", "\\${");

	const replacements = {};
	let i = 0;
	while (true) {
		i = source.indexOf("$", i) + 1;

		if (i <= 0) {
			break;
		}

		const end = source.indexOf("$", i);

		if (end < 0) {
			break;
		}

		const replacementVariable = source.substring(i, end);
		replacements[replacementVariable] = 1;
		source = source.substring(0, i - 1) + `\${${replacementVariable}}` + source.substring(end + 1);
		i = end + 1;
	}

	source = `\`${source}\``;

	const replacementList = [];

	for (const replacement in replacements) {
		replacementList.push(replacement);
	}

	const replacementArguments = replacementList.length > 0
		? `{ ${replacementList.join(", ")} }`
		: "";

	return `export default (${replacementArguments}) => ${source};`;
};
