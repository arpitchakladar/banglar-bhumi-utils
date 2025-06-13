chrome.runtime.onMessage.addListener(async (message, sender, sendResponse) => {
	if (message.type === "ping") {
		console.log("Received ping from content script");
		console.log(message.data);
		sendResponse({ text: "pong" });
	}
});
