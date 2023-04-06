// TODO: Use the local static asset
const sanghaFacilitationCentreBannerUrl = /* chrome.runtime.getURL("/sangha-facilitation-centre-banner.jpg") */ "https://raw.githubusercontent.com/arpitchakladar/banglar-bhumi-utils/master/static/sangha-facilitation-centre-banner.jpg";

export default (khatianDetails: string, { district, block, mouza }: { district: string, block: string, mouza: string }) => `
<style>
	* {
		box-sizing: border-box !important;
		text-decoration: none;
		margin: 0;
		padding: 0;
	}

	body {
		width: 100%;
		height: 100%;
		margin: 0 !important;
		padding: 0 !important;
	}

	#content {
		width: 100%;
		margin: 0;
		padding: 0;
	}

	.banner {
		width: 100%;
	}

	.khatian-details {
		padding: 1rem;
	}

	.khatian-details > table {
		width: 100% !important;
		border-spacing: 0;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) {
		width: 100% !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(2) {
		display: none;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(1),
	.khatian-details > table > tbody > tr > td:nth-child(1) > p:nth-child(4) {
		text-align: center;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) {
		width: 100% !important;
		position: initial !important;
		left: 0 !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table,
	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table {
		width: 100% !important;
		border: none !important;
	}

	.khatian-details table tbody tr tr,
	.khatian-details table tbody tr th,
	.khatian-details table tbody tr td {
		border: none !important;
		background-color: transparent;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) td,
	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) th {
		text-align: left;
	}

	.khatian-details > table > tbody > tr > td > div > table > tbody > tr > th,
	.khatian-details > table > tbody > tr > td > div > table > tbody > tr > td {
		padding: 0 0.2rem 0 0.2rem;
	}

	.khatian-details table tbody tr tr {
		border-bottom: 1px solid #808080 !important;
	}

	.khatian-details table tbody tr tr:last-child {
		border: none;
	}
	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1) > th {
		font-weight: 500;
	}

	.khatian-details table tbody tr th, .khatian-details table tbody tr td {
		border-right: 1px solid #808080 !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1),
	#headertitle > tr {
		border-top: 1px solid #808080 !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody > tr:last-child {
		border: none !important;
	}

	.khatian-details > table tbody tr tr th:last-child, .khatian-details table tbody tr tr td:last-child {
		border-right: none !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > p:nth-child(4) {
		margin-top: 1rem !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(5) {
		position: initial !important;
		left: 0 !important;
		top: 0 !important;
		margin: 0 !important;
		width: 100% !important;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > p:nth-child(3) {
		display: none;
	}

	.khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1) > th {
		width: 50%;
	}

	.footer {
		width: 100%;
		margin-top: 1rem;
	}
</style>
<img class="banner" src="https://banglarbhumi.gov.in/BanglarBhumi/images/bl.png">
<div class="khatian-details">${khatianDetails}</div>
<img class="footer" src="${sanghaFacilitationCentreBannerUrl}">
<script>
	const tableBodyElement = document.querySelector(".khatian-details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody");
	const headerLabelElement = tableBodyElement.querySelector("tr:nth-child(1) > th:nth-child(1)");
	const headerValueElement = tableBodyElement.querySelector("tr:nth-child(1) > th:nth-child(2)");
	const khatianNumberText = headerLabelElement.innerHTML;
	const khatianNumberValue = headerValueElement.innerHTML;
	headerLabelElement.innerHTML = "\u{99C}\u{9C7}\u{9B2}\u{9BE} (District):"
	headerValueElement.innerHTML = "${district}";
	const nextElement = tableBodyElement.querySelector("tr:nth-child(2)");
	const createTableEntry = (label, value) => {
		const tableRowElement = document.createElement("tr");
		const tableLabelColumnElement = document.createElement("td");
		tableLabelColumnElement.innerHTML = label;
		const tableValueColumnElement = document.createElement("td");
		tableValueColumnElement.innerHTML = value;
		tableRowElement.appendChild(tableLabelColumnElement);
		tableRowElement.appendChild(tableValueColumnElement);
		tableBodyElement.insertBefore(tableRowElement, nextElement);
	}
	createTableEntry("\u{9AC}\u{9CD}\u{9B2}\u{995} (Block):", "${block}");
	createTableEntry("\u{9AE}\u{9CC}\u{99C}\u{9BE} (Mouza):", "${mouza}");
	createTableEntry(khatianNumberText, khatianNumberValue);
</script>
`;
