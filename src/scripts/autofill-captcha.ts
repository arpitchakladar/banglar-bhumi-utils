const autofillCaptcha = () => {
	let captchas = Array.from(document.querySelectorAll("#txtCaptcha")) as HTMLInputElement[];

	for (const captcha of captchas) {
		const captchaInput = captcha.parentElement!.querySelector("#txtInput") as HTMLInputElement | null;
		if (captchaInput) {
			captchaInput.value = captcha.value.replaceAll(" ", "");
			captchaInput.style.display = "none";
			captcha.style.display = "none";
		}
	}

	captchas = Array.from(document.querySelectorAll("#captchaText")) as HTMLInputElement[];
	for (const captcha of captchas) {
		const captchaParentElement = captcha.parentElement!;
		if (captchaParentElement.id === "drawTextSpan") {
			const captchaInput = captchaParentElement.parentElement!.querySelector("#drawText1") as HTMLInputElement | null;
			if (captchaInput) {
				captchaInput.value = captcha.value.replaceAll(" ", "");
				captchaParentElement.parentElement!.style.display = "none";
			}
		}
	}

	setTimeout(autofillCaptcha, 1000);
};

autofillCaptcha();
