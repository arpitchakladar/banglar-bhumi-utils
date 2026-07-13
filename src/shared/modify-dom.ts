import { observeDOM } from "@/shared/observe-dom";

type DOMReplacements = {
	innerHTML?: string;
	[key: string]: string | undefined | null
};
type DOMModificaitonRule = readonly [string, DOMReplacements];
type DOMModificationRules = (DOMModificaitonRule | null)[];

let domModificationRules: DOMModificationRules = [];
let domModificationFinishedCount = 0;

/**
 * Runs whenever the DOM mutates.  Iterates over pending modification
 * rules; when the selector matches, the element's innerHTML and
 * attributes are updated and the rule is marked as complete.
 */
observeDOM(() => {
	for (let i = 0; i < domModificationRules.length; i++) {
		const rule = domModificationRules[i];
		if (rule?.[0]) {
			const element = document.querySelector(rule[0]);

			if (element) {
				const attributes = rule[1];

				if (attributes.innerHTML) {
					element.innerHTML = attributes.innerHTML;
				}

				delete attributes.innerHTML;

				for (const attributeName in attributes) {
					const attribute = attributes[attributeName];
					if (attribute) {
						element.setAttribute(attributeName, attribute);
					} else {
						element.removeAttribute(attributeName);
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

/**
 * Registers one or more DOM modification rules.  Each rule is a tuple of
 * `[selector, attributeMap]`.  When an element matching the selector is
 * found, its `innerHTML` is replaced (if `attributeMap.innerHTML` is set)
 * and all other entries in the map are applied as `setAttribute` calls
 * (or `removeAttribute` when the value is `null`).
 *
 * @param modificationRules - Array of `[selector, attributes]` rules.
 */
export function modifyDOM(modificationRules: DOMModificationRules): void {
	domModificationRules = domModificationRules.concat(modificationRules);
};
