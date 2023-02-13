import observeDOM from "@/utils/observe-dom";

const replace: (any[] | undefined)[] = [
	["#slider > img", { src: "" }],
	["#slider > img.nivo-main-image", { src: "" }]
];
let count = 0;

observeDOM(() => {
	for (let i = 0; i < replace.length; i++) {
		if (replace[i]) {
			const element = document.querySelector(replace[i]![0]) as HTMLElement | null;
			if (element) {
				const attributes = replace[i]![1];
				if (attributes.innerHTML) {
					element.innerHTML = attributes.innerHTML;
				}
				delete attributes.innerHTML;
				for (const attribute in attributes) {
					element.setAttribute(attribute, attributes[attribute]);
				}
				replace[i] = undefined;
				count++;
				if (count >= replace.length) {
					return true;
				}
			}
		}
	}

	return false;
});
