import { observeDOM } from "@/utils/observe-dom";

type Replacements = {
	innerHTML?: string;
	styles?: {
		[key: string]: string
	};
} | {
	[key: string]: string | null
};

export class DOMModifier {
	selector: string;
	replaced: Replacements;
	constructor(selector: string, replaced: Replacements) {
		this.selector = selector;
		this.replaced = replaced;
	}
}

export const modifyDOM = (elements: (DOMModifier | null)[]) => {
	let count = 0;

	observeDOM(() => {
		for (let i = 0; i < elements.length; i++) {
			if (elements[i]) {
				const element = document.querySelector(elements[i]!.selector) as HTMLElement | null;
				if (element) {
					const attributes = elements[i]!.replaced as any;
					if (attributes.innerHTML) {
						element.innerHTML = attributes.innerHTML;
					}
					if (attributes.styles) {
						for (const styleType in attributes.styles) {
							element.style[styleType as any] = attributes.styles[styleType];
						}
					}
					delete attributes.innerHTML;
					delete attributes.styles;
					for (const attribute in attributes) {
						if (attributes[attribute] === null) {
							element.removeAttribute(attribute);
						} else {
							element.setAttribute(attribute, attributes[attribute]);
						}
					}
					elements[i] = null;
					count++;
					if (count >= elements.length) {
						return true;
					}
				}
			}
		}

		return false;
	});
};
