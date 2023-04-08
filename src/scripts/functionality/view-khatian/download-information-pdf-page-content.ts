const sanghaFacilitationCentreBannerUrl = chrome.runtime.getURL("/assets/sangha-facilitation-centre-banner.jpg");

export default (isPlotInformation: boolean, details: string, { district, block, mouza }: { district: string, block: string, mouza: string }) => `
<style>
	* {
		box-sizing: border-box !important;
		text-decoration: none;
		margin: 0;
		padding: 0;
	}

	body {
		width: 100%;
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

	.details {
		padding: 1rem;
	}

	#locater-information {
		width: 100%;
		margin-bottom: 1rem;
	}

	#locater-information,
	.details#plot-information > div:nth-child(1) > div:nth-child(5) > table {
		border-collapse: collapse;
	}

	.details#khatian-information > table,
	.details#plot-information > div:nth-child(1) {
		width: 100% !important;
		border-spacing: 0;
		border: 1px solid black;
	}

	.details#plot-information > div:nth-child(1) > div:nth-child(1) {
		text-align: center !important;
	}

	.details#plot-information > div:nth-child(1) > div:nth-child(1) {
		margin: 0 !important;
	}

	.details#plot-information > div > div > table tr {
		border-bottom: 1px solid black;
	}

	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > th:last-child,
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td:last-child,
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table,
	.details#plot-information > div:nth-child(1) > div:nth-child(5) > table > tbody > tr > td:last-child,
	.details#plot-information #headertitle > tr > th:last-child,
	.details#plot-information > div:nth-child(1) > div:nth-child(5) > table > tbody > tr:last-child {
		border: none !important;
	}

	.details#plot-information > div:nth-child(1) > div {
		position: initial !important;
		left: 0 !important;
		width: 100% !important;
		border-left: 0 !important;
		border-right: 0 !important;
	}

	.details#plot-information > div:nth-child(2),
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td:nth-child(4),
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > th:nth-child(4),
	.details#khatian-information > table > tbody > tr > td:nth-child(1) > p:nth-child(3),
	.details#khatian-information > table > tbody > tr > td:nth-child(2) {
		display: none !important;
	}

	.details#plot-information > div:nth-child(1) > div:nth-child(5) > table > tbody > tr {
		background-color: transparent !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1),
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table {
		width: 100% !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(1),
	.details#khatian-information > table > tbody > tr > td:nth-child(1) > p:nth-child(4) {
		text-align: center;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) {
		width: 100% !important;
		position: initial !important;
		left: 0 !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table,
	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table {
		width: 100% !important;
		border: none !important;
	}

	.details table tbody tr tr,
	.details table tbody tr th,
	.details table tbody tr td {
		border: none !important;
		background-color: transparent;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) td,
	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) th {
		text-align: left;
	}

	.details#khatian-information > table > tbody > tr > td > div > table > tbody > tr > th,
	.details#khatian-information > table > tbody > tr > td > div > table > tbody > tr > td,
	.details#plot-information td {
		padding: 0 0.2rem 0 0.2rem;
	}

	.details table tbody tr tr,
	#locater-information tr {
		border-bottom: 1px solid black !important;
	}

	.details table tbody tr tr:last-child {
		border: none;
	}
	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1) > th {
		font-weight: 500;
	}

	.details table tbody tr th,
	.details table tbody tr td,
	.details#plot-information #headertitle > tr > th {
		border-right: 1px solid black !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1),
	#headertitle > tr,
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr.table-text.knwurprpty_tbl_head_txt.ng-scope,
	#headertitle,
	#locater-information tr:nth-child(1) {
		border-top: 1px solid black !important;
		border-color: black !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody > tr:last-child,
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > td:nth-child(3),
	.details#plot-information > div:nth-child(1) > div:nth-child(3) > table > tbody > tr > th:nth-child(3),
	.details#khatian-information > table tbody tr tr th:last-child, .details table tbody tr tr td:last-child,
	#locater-information tr > td:last-child {
		border-right: none !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > p:nth-child(4) {
		margin-top: 1rem !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(5),
	.details#plot-information > div:nth-child(1) > div:nth-child(5) {
		position: initial !important;
		left: 0 !important;
		top: 0 !important;
		margin: 0 !important;
		width: 100% !important;
	}

	.details#khatian-information > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody > tr:nth-child(1) > th {
		width: 50%;
	}

	.footer {
		width: 100%;
		margin-top: 1rem;
	}
</style>
<img class="banner" src="https://banglarbhumi.gov.in/BanglarBhumi/images/bl.png">
<div class="details" id=${isPlotInformation ? "plot-information" : "khatian-information"}>${details}</div>
<img class="footer" src="${sanghaFacilitationCentreBannerUrl}">
<script>
	let tableBodyElement;
	const createTableEntry = (label, value) => {
		const tableRowElement = document.createElement("tr");
		const tableLabelColumnElement = document.createElement("td");
		tableLabelColumnElement.innerHTML = label;
		const tableValueColumnElement = document.createElement("td");
		tableValueColumnElement.innerHTML = value;
		tableRowElement.appendChild(tableLabelColumnElement);
		tableRowElement.appendChild(tableValueColumnElement);
		tableBodyElement.appendChild(tableRowElement);
	};
	${isPlotInformation
		? `
			const tableElement = document.createElement("table");
			tableElement.setAttribute("id", "locater-information");
			tableBodyElement = document.createElement("tbody");
			tableElement.appendChild(tableBodyElement);
			const detailsElement = document.querySelector("#plot-information > div:nth-child(1)");
			detailsElement.insertBefore(tableElement, detailsElement.querySelector("div:nth-child(2)"));
		`
		: `
			tableBodyElement = document.querySelector(".details > table > tbody > tr > td:nth-child(1) > div:nth-child(2) > table > tbody");
		`
	}
	createTableEntry("\u{99C}\u{9C7}\u{9B2}\u{9BE} (District):", "${district}");
	createTableEntry("\u{9AC}\u{9CD}\u{9B2}\u{995} (Block):", "${block}");
	createTableEntry("\u{9AE}\u{9CC}\u{99C}\u{9BE} (Mouza):", "${mouza}");
</script>
`;
