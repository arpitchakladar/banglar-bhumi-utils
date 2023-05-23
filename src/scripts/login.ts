document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;

	$.post = function() {
		if (arguments[0].endsWith("viewLoginAreaAction")) {
			(window as any).DrawLoginCaptcha = () => {};
			const callback = arguments[1];
			arguments[1] = (html: any) => {
				callback(html);
				const captchaValueElement = document.getElementById("txtCaptcha") as HTMLInputElement;
				const captchaInputElement = document.getElementById("txtInput") as HTMLInputElement;
				captchaValueElement.value = "ffffff";
				captchaInputElement.value = "ffffff";
				captchaValueElement.style.display = "none";
				captchaInputElement.style.display = "none";
				(document.querySelector(".captcharefresh") as HTMLElement).style.display = "none";
			}
		} else if (arguments[0].endsWith("viewPasswordRecoveryArea")) {
			(window as any).Captcha = () => {};
			const callback = arguments[1];
			arguments[1] = (html: any) => {
				callback(html);
				const captchaInputElement = document.getElementById("dText") as HTMLInputElement;
				const captchaValueElement = document.getElementById("captaText") as HTMLInputElement;
				captchaValueElement.value = "ffffff";
				captchaInputElement.value = "ffffff";
				captchaValueElement.style.display = "none";
				captchaInputElement.style.display = "none";
				(document.getElementById("captchaRef") as HTMLElement).style.display = "none";
			}
		} else if (arguments[0].endsWith("login.action")) {
			const callback = arguments[2];
			arguments[2] = (data: any) => {
				if (!data.exception && data.checkmsg === "success") {
					window.localStorage.setItem("loginData", btoa(JSON.stringify(arguments[1])));
				}

				callback(data);
			};
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	};

	setInterval(() => {
		let loginData = window.localStorage.getItem("loginData");
		loginData = loginData ? JSON.parse(atob(loginData)) : null;

		if (loginData) {
			$.post(
				"/BanglarBhumi/login.action",
				loginData,
				data => {
					if (data.exception || data.checkmsg !== "success") {
						loginData = null;
					}
				},
				"json"
			);
		}
	}, 1000 * 60 * 5);
});
