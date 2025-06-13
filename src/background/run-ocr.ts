import Tesseract from "tesseract.js";
//
// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
// 	if (message.type === "OCR") {
// 		(async () => {
// 			const { data: { text, confidence } } = await Tesseract.recognize(message.dataURL, "eng+osd", {
// 				logger: m => console.log(m),
// 			});
// 			sendResponse({ text, confidence });
// 		})();
// 		return true;
// 	}
//
// 	return false;
// });

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "OCR") {
		(async () => {
			console.log(message);
			const worker = await Tesseract.createWorker("eng", 1, {
				workerBlobURL: false,
				logger: console.log,
			});

			await worker.setParameters({
				tessedit_char_whitelist: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
			});

			const {
				data: { text, confidence }
			} = await worker.recognize(message.dataURL);

			await worker.terminate();

			sendResponse({ type: "OCR_RESULT", text, confidence });
		})();

		return true;
	}

	return false;
});
