document.addEventListener("DOMContentLoaded", () => {
	(window as any).validateCaptcha = () => true;
	$("#khatianPlotDiv > div:nth-child(6) > div").hide();
});
