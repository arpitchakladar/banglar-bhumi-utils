import { modifyDOM, DOMModifier } from "@/utils/modify-dom";

const bannerImageUrl = chrome.runtime.getURL("assets/banner.jpg");

modifyDOM([
	new DOMModifier("#slider > img", {
		src: bannerImageUrl,
		styles: {
			position: "initial",
			width: "100vw"
		}
	}),
	new DOMModifier("#slider", {
		styles: {
			overflow: "visible",
			position: "initial"
		}
	}),
	new DOMModifier("#form_MainMenuPage > div > div.logo-div.row.ng-scope > div.top_link_icon.col-sm-7.float-right", {
		styles: {
			width: "100%",
			display: "flex",
			justifyContent: "space-around",
			paddingTop: "5px"
		}
	})
]);
