export function styles(selector: string, styles: Record<string, string>) {
	const  elements = Array.from(document.querySelectorAll(selector)) as HTMLElement[];

	for (const element of elements) {
		for (const styleType in styles) {
			element.style[styleType as any] = styles[styleType];
		}
	}
};
