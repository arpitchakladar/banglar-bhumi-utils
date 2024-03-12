$("#form_reprint_request")
	.removeAttr("id")
	.removeAttr("name")
	.removeAttr("onsubmit")
	.removeAttr("target")
	.removeAttr("autocomplete")
	.removeAttr("rel");

const captchaElement = $("#werter > div > div:nth-child(4)");

if (captchaElement.length > 0) {
	const captchaValueElement = $("#captchaText");
	const captchaFieldElement = $("[name=txtDrawText]");

	setInterval(() => {
		captchaFieldElement.val("FFFFFF");
		captchaValueElement.val("FFFFFF");
		captchaElement.hide();
	}, 1000);
}
