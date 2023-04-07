export const downloadPDF = (content: string) => {
	const tab = window.open("about:blank", "_blank");

	if (tab) {
		tab.document.write(content);
		tab.document.close();
		tab.focus();
		Promise.all(Array.from(tab.document.images)
			.filter(img => !img.complete)
			.map(img => new Promise(resolve => {
				img.onload = img.onerror = resolve;
			}))).then(() => {
				tab.print();
				tab.close();
			});
	}
};
