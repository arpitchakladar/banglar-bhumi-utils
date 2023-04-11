export const generateWebPage = (content: string) => {
	const tab = window.open("about:blank", "_blank");

	if (tab) {
		tab.document.write(content);
		tab.document.close();
		tab.focus();
	}
};
