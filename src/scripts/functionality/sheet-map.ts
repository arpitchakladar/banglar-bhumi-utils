const downloadButtonContainer = document.createElement("td");
const downloadButton = document.createElement("button");
downloadButton.innerHTML = "DOWNLOAD";
downloadButtonContainer.appendChild(downloadButton);
const svgElement = document.querySelector("svg");
(document.querySelector("#headerTable > tbody > tr") as any).appendChild(downloadButtonContainer);
downloadButton.addEventListener("click", e => {
	e.preventDefault();
	(document.querySelector("#btnResetZoom") as any).click()
	function download(filename: string, text: string) {
		const element = document.createElement("a");
		element.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
		element.setAttribute("download", filename);
		element.style.display = "none";
		document.body.appendChild(element);
		element.click();
		document.body.removeChild(element);
	}
	download("map.svg", $("#OpenLayers_Layer_Vector_RootContainer_35").html());
});
