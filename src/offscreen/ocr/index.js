import Tesseract from "./tesseract.esm.min.js";

let ocrWorker = null;
const WORKER_PATH = chrome.runtime.getURL("/offscreen/ocr/static/worker.min.js");
const CORE_PATH = chrome.runtime.getURL("/offscreen/ocr/static");

async function performOcrInOffscreen(dataURL) {
	if (!ocrWorker) {
		ocrWorker = await Tesseract.createWorker("eng", 1, {
			workerPath: WORKER_PATH,
			corePath: CORE_PATH,
			workerBlobURL: false,
		});

		await ocrWorker.setParameters({
			// The only characters that appears
			tessedit_char_whitelist: "ABCDEFGHJKLMNPQRSTUVWXYZ23456789",
		});
	}

	const { data } = await ocrWorker.recognize(dataURL);
	return data;
}

// Listen for messages from the Service Worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.type === "OFFSCREEN_OCR_REQUEST" && message.dataURL) {
		performOcrInOffscreen(message.dataURL)
			.then(({ text, confidence }) => {
				sendResponse({ success: true, text, confidence });
			})
			.catch(error => {
				sendResponse({ success: false, error: error.message });
			});
		return true;
	}

	if (message.type === "OFFSCREEN_TERMINATE_OCR_WORKER") {
		if (ocrWorker) {
			ocrWorker.terminate();
			ocrWorker = null;
		}
		sendResponse({ success: true });
	}
});
