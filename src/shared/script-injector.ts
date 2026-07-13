type DataType = Record<string, string>;

/**
 * Injects a `<script>` element into the document head (or `<html>`) with
 * the given `src` pointing to an extension resource.  Optional key/value
 * data is attached as `data-*` attributes so the injected script can
 * read them via `document.currentScript`.
 *
 * @param src  - The extension-relative script path.
 * @param data - Optional key/value pairs to set as `data-*` attributes.
 */
export function injectScriptHead(src: string, data: DataType = {}): void {
	const s = document.createElement("script");
	s.src = chrome.runtime.getURL(src);
	for (const i in data) {
		s.setAttribute(`data-${i}`, data[i]);
	}
	document.head.append(s);
};
