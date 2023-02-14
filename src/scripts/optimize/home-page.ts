import { replaceAttributes } from "@/utils/replace-attributes";

const bannerImageUrl = chrome.runtime.getURL("assets/banner.jpg");

replaceAttributes([
	["#form_MainMenuPage > div > div:nth-child(13)", { innerHTML: `<img src="${bannerImageUrl}" style="width: 100vw" />` }]
]);
