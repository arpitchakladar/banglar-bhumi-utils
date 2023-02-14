import { observeDOM } from "@/utils/observe-dom";

type Replacements = {
	[key: string]: string | null
};

export class DOMModifier {
	selector: string;
	attributes: Replacements;
	constructor(selector: string, attributes: Replacements) {
		this.selector = selector;
		this.attributes = attributes;
	}
}

export const modifyDOM = (elements: (DOMModifier | null)[]) => {
	let count = 0;

	observeDOM(() => {
		for (let i = 0; i < elements.length; i++) {
			if (elements[i]) {
				const element = document.querySelector(elements[i]!.selector) as HTMLElement | null;
				if (element) {
					const attributes = elements[i]!.attributes as any;
					if (attributes.innerHTML) {
						element.innerHTML = attributes.innerHTML;
					}
					delete attributes.innerHTML;
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
