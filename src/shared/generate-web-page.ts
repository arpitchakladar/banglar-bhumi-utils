export function generateWebPage(content: string, title: string = "Banglar Bhumi") {
	const tab = window.open("about:blank", "_blank");
	if (!tab) {
		return;
	}

	tab.document.write(content);
	tab.document.close();
	tab.document.title = title;
	tab.focus();
};
