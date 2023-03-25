import { observeDOM } from "@/utils/observe-dom";

type DOMReplacements = {
	innerHTML?: string;
	[key: string]: string | undefined | null;
};

type DOMModificaitonRule = readonly [string, DOMReplacements];

export const modifyDOM = (modificationRules: (DOMModificaitonRule | null)[]) => {
	let count = 0;

	observeDOM(() => {
		for (let i = 0; i < modificationRules.length; i++) {
			if (modificationRules[i]) {
				const element = document.querySelector(modificationRules[i]![0]) as HTMLElement | null;
				if (element) {
					const attributes = modificationRules[i]![1] as DOMReplacements;
					if (attributes.innerHTML) {
						element.innerHTML = attributes.innerHTML as string;
					}
					delete attributes.innerHTML;
					for (const attribute in attributes) {
						if (attributes[attribute] === null) {
							element.removeAttribute(attribute);
						} else {
							element.setAttribute(attribute, attributes[attribute] as string);
						}
					}
					modificationRules[i] = null;
					count++;
					if (count >= modificationRules.length) {
						return true;
					}
				}
			}
		}

		return false;
	});
};
