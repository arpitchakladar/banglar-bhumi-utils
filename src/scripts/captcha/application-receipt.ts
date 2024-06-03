document.addEventListener("DOMContentLoaded", () => {
	$("#werter > div > form > div:nth-child(4)").hide();
	(window as any).validateForm = () => true;
	const captchaElement = $("#werter > div > div:nth-child(4)");
});
