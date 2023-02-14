import { modifyDOM, DOMModifier } from "@/utils/modify-dom";

const bannerImageUrl = chrome.runtime.getURL("assets/banner.jpg");

modifyDOM([
	new DOMModifier("#slider > img", {
		src: bannerImageUrl
	})
]);
