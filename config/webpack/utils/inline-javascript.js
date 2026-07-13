/**
 * Wraps JavaScript source code in a base64-encoded data URI so it can be
 * used as an inline webpack entry point without writing a physical file.
 *
 * @param {string} code - The JavaScript source to inline.
 * @returns {string} A `data:text/javascript;base64,…` URI.
 */
export function inlineJavascript(code) {
	return `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
}
