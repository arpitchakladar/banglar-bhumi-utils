const autoPrintCode = `
<script>
	document.addEventListener("DOMContentLoaded", () => {
		Promise.all(Array.from(document.images)
			.filter(img => !img.complete)
			.map(img => new Promise(resolve => {
				img.onload = img.onerror = resolve;
			}))).then(() => {
				window.print();
				window.close();
			});
	});
</script>
`;

export const downloadPDF = (content: string) => {
	const tab = window.open("about:blank", "_blank");

	if (tab) {
		tab.document.write(content + autoPrintCode);
		tab.document.close();
	}
};
