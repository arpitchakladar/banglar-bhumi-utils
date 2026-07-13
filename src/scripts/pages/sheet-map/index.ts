import getDownloadMapPDFPageContent from "@/scripts/pages/sheet-map/download-map-pdf-page-content.html";
import getMapPlotNumberLabelTextElement from "@/scripts/pages/sheet-map/map-plot-number-label-text-element.html";
import getMapPlotPolygonPathElement from "@/scripts/pages/sheet-map/map-plot-polygon-path-element.html";
import getPlotInformationElement from "@/scripts/pages/sheet-map/plot-information-element.html";
import { generateWebPage } from "@/shared/generate-web-page";

type PlotPolygon = {
	plotArea: number;
	plotno: string;
	polygon: string
};

type PlotNumberLabel = {
	plotno: string;
	point: string
};

const headerElement = document.querySelector<HTMLTableRowElement>("#headerTable > tbody > tr");
const plotNumberInput = document.querySelector<HTMLInputElement>("#txtPlotNo");
const plotInformation = document.createElement("div");
let plotPolygonPathElements = "";
let plotNumberLabelTextElements = "";

document.body.appendChild(plotInformation);

/**
 * Creates a header toolbar button and appends it to the page header.
 * The button starts hidden and is shown when data is ready.
 *
 * @param text - The button label text.
 * @returns The created button element.
 */
function createHeaderButton(text: string): HTMLButtonElement {
	const buttonContainer = document.createElement("td");
	const button = document.createElement("button");
	button.innerHTML = text;
	button.style.display = "none";
	buttonContainer.appendChild(button);
	if (headerElement)
		headerElement.appendChild(buttonContainer);
	return button;
};

/**
 * Displays the area and plot number for the given polygon in a floating
 * info panel, or shows "0.000" / empty if no polygon is selected.
 *
 * @param plotPolygon - The selected plot's data, or `null`/`undefined` to clear.
 */
function setPlotInformation(plotPolygon: PlotPolygon | null | undefined = null): void {
	plotInformation.innerHTML = plotPolygon
		? getPlotInformationElement({
			area: (plotPolygon.plotArea / 1000).toFixed(3),
			plotNumber: plotPolygon.plotno
		})
		: getPlotInformationElement({
			area: "0.000",
			plotNumber: ""
		});
};

/**
 * Opens a new window with a printable PDF view of the map, optionally
 * including plot-number labels.
 *
 * @param labelPoints - Whether to include plot number text labels.
 */
function downloadPDF(labelPoints = true): void {
	/** Extracts a detail value (district/block/mouza) from the header table by column index. */
	function _getMapDetail(i: number): string {
		const detail = (document.querySelector<HTMLTableCellElement>(`#headerTable > tbody > tr > td:nth-child(${i.toString()})`)?.innerHTML ?? "")
			.split("[")[1]
			.trim();
		return detail.substring(0, detail.length - 1);
	};
	generateWebPage(
		getDownloadMapPDFPageContent({
			district: _getMapDetail(1),
			block: _getMapDetail(2),
			mouza: _getMapDetail(3),
			mapContent: plotPolygonPathElements + (labelPoints ? plotNumberLabelTextElements : "")
		}),
		"map"
	);
};

const downloadPDFButton = createHeaderButton("SAVE PDF");
const downloadPDFNoLabelButton = createHeaderButton("SAVE PDF (NO LABEL)");

downloadPDFButton.addEventListener("click", (e) => {
	e.preventDefault();
	downloadPDF();
});

downloadPDFNoLabelButton.addEventListener("click", (e) => {
	e.preventDefault();
	downloadPDF(false);
});

setPlotInformation();

void (async function(): Promise<void> {
	const searchParams = new URLSearchParams(window.location.search);
	const sheetMapLayerDataResponse = await fetch(
		`/BanglarBhumi/sheetMap_populateLayerData?lstSheetNo=${searchParams.get("lstSheetNo")?.toString() ?? ""}`,
		{
			method: "POST"
		});
	type SheetMapLayerDataResponseType = {
		features: PlotPolygon[]
	};
	const sheetMapLayerDataResponseJson
		=	await sheetMapLayerDataResponse.json() as SheetMapLayerDataResponseType;
	const plotPolygonList: PlotPolygon[] = sheetMapLayerDataResponseJson.features;
	const sheetMapCentroidDataResponse = await fetch(
		`/BanglarBhumi/sheetMap_populateCentroidData?lstSheetNo=${searchParams.get("lstSheetNo")?.toString() ?? ""}`,
		{
			method: "POST"
		});
	type SheetMapCentroidDataResponseType = {
		features: PlotNumberLabel[]
	};
	const sheetMapCentroidDataResponseJson
		= await sheetMapCentroidDataResponse.json() as SheetMapCentroidDataResponseType;
	const plotNumberLabelList: PlotNumberLabel[] = sheetMapCentroidDataResponseJson.features;
	const plotPolygons: Record<string, PlotPolygon> = {};

	for (const plotPolygon of plotPolygonList) {
		const plotPolygonPoints = plotPolygon.polygon.split("(((")[1].split(")))")[0];
		plotPolygonPathElements += getMapPlotPolygonPathElement({
			polygonVertices: plotPolygonPoints
		});
	}

	for (const plotNumberLabel of plotNumberLabelList) {
		const plotNumberLabelPoint = plotNumberLabel.point.split("(")[1].split(")")[0].split(" ");
		plotNumberLabelTextElements += getMapPlotNumberLabelTextElement({
			x: plotNumberLabelPoint[0],
			y: plotNumberLabelPoint[1],
			plotNumber: plotNumberLabel.plotno
		});
	}

	downloadPDFButton.style.display = "inherit";
	downloadPDFNoLabelButton.style.display = "inherit";

	document.querySelector<HTMLButtonElement>("#btnSearch")?.addEventListener("click", () => {
		let plotPolygon;
		for (const p of plotPolygonList) {
			if (p.plotno === plotNumberInput?.value) {
				plotPolygon = p;
				break;
			}
		}
		setPlotInformation(plotPolygon);
	});

	await new Promise<void>((resolve, _reject) => {
		const plotElementIdsControl = setInterval(() => {
			const plotElements = document.querySelector("#OpenLayers_Layer_Vector_25_vroot")?.children ?? [];
			if (plotElements.length) {
				clearInterval(plotElementIdsControl);
				for (let i = 0; i < plotElements.length; i++) {
					plotPolygons[plotElements[i].id] = plotPolygonList[i];
				}
				resolve();
			}
		}, 50);
	});

	setInterval(() => {
		for (const plotElementId in plotPolygons) {
			const e = document.getElementById(plotElementId);
			if (e) {
				e.removeEventListener("click", handlePlotClick);
				e.addEventListener("click", handlePlotClick);
			}
		}
	}, 300);

	/**
	 * Highlights the clicked plot on the SVG map and shows its
	 * information in the info panel.
	 *
	 * @param e - The mouse click event.
	 */
	function handlePlotClick(e: MouseEvent): void {
		document.querySelectorAll("path").forEach((e) => {
			e.setAttribute("fill", "#ffcc66");
		});

		const target = e.target as SVGPathElement;

		target.setAttribute("fill", "#8aeeef");
		setPlotInformation(plotPolygons[target.id]);
	};
})();
