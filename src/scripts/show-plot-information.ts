declare function loadKhatian(): void;

document.addEventListener("DOMContentLoaded", () => {
	(window as any).customLoadKhatian = () => {
		loadKhatian();
		setTimeout(() => {
			(document.querySelector("#khdetails > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody") as any).style.height = "auto";
		}, 1000);
	};
	document.querySelector("#khbutton")!.setAttribute("onclick", "customLoadKhatian()");
});
