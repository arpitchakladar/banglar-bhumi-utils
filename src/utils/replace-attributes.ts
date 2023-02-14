import { observeDOM } from "@/utils/observe-dom";

export const replaceAttributes = (elements: any[]) => {
	let count = 0;

	observeDOM(() => {
		for (let i = 0; i < elements.length; i++) {
			if (elements[i]) {
				const element = document.querySelector(elements[i]![0]) as HTMLElement | null;
				if (element) {
					const attributes = elements[i]![1];
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
					elements[i] = undefined;
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
