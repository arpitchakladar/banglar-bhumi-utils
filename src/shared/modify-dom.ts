import { observeDOM } from "@/shared/observe-dom";

type DOMReplacements = {
	innerHTML?: string;
	[key: string]: string | undefined | null;
};
type DOMModificaitonRule = readonly [string, DOMReplacements];
type DOMModificationRules = (DOMModificaitonRule | null)[];

let domModificationRules: DOMModificationRules = [];
let domModificationFinishedCount = 0;

observeDOM(() => {
	for (let i = 0; i < domModificationRules.length; i++) {
		if (domModificationRules[i]) {
			const element = document.querySelector(domModificationRules[i]![0]) as HTMLElement | null;

			if (element) {
				const attributes = domModificationRules[i]![1];

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

				domModificationRules[i] = null;
				domModificationFinishedCount++;

				if (domModificationFinishedCount >= domModificationRules.length) {
					return true;
				}
			}
		}
	}

	return false;
});

export function modifyDOM(modificationRules: DOMModificationRules) {
	domModificationRules = domModificationRules.concat(modificationRules);
};
