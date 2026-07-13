/**
 * Opens a new browser tab and writes the given HTML content into it.
 * Used to display dynamically-generated pages (e.g. PDF-printable views).
 *
 * @param content - The full HTML string to write.
 * @param title   - The document title (default: `"Banglar Bhumi"`).
 */
export function generateWebPage(content: string, title: string = "Banglar Bhumi") {
	const tab = window.open("about:blank", "_blank");
	if (!tab) {
		return;
	}

	tab.addEventListener("DOMContentLoaded", () => {
		tab.document.body.innerHTML = content;
		tab.document.title = title;
		tab.document.close();
	});
	tab.focus();
};
