import Tesseract from "tesseract.js";

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "OCR") {
		(async () => {
			const { data: { text, confidence } } = await Tesseract.recognize(message.dataURL, "eng+osd", {
				logger: m => console.log(m),
			});
			sendResponse({ text, confidence });
		})();
		return true;
	}

	return false;
});
