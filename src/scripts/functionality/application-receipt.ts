const receiptFormElement = document.getElementById("form_reprint_request") as HTMLElement;
receiptFormElement.removeAttribute("id");
receiptFormElement.removeAttribute("name");
receiptFormElement.removeAttribute("onsubmit");
receiptFormElement.removeAttribute("target");
receiptFormElement.removeAttribute("autocomplete");
receiptFormElement.removeAttribute("rel");

let captchaElement = document.querySelector("#werter > div > div:nth-child(4)") as HTMLElement;

if (captchaElement) {
	captchaElement = captchaElement!;
	const captchaValueElement = document.getElementById("captchaText") as HTMLInputElement;
	const captchaFieldElement = document.querySelector("[name=txtDrawText]") as HTMLInputElement;
	const removeCaptcha = () => {
		captchaFieldElement.value = captchaValueElement.value;
		captchaElement.style.display = "none";
		setTimeout(removeCaptcha, 1000);
	};
	removeCaptcha();
}
