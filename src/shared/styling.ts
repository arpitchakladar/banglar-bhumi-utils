/**
 * Applies a set of inline CSS styles to every element matching the
 * given CSS selector.
 *
 * @param selector - CSS selector string.
 * @param styles   - A map of CSS property names to values.
 */
export function styles(selector: string, styles: Record<string, string>) {
	const  elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

	for (const element of elements) {
		for (const styleType in styles) {
			element.style[styleType as any] = styles[styleType];
		}
	}
};
