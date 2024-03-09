import { interceptPost, interceptGet } from "@/shared/intercept-jquery-ajax";

document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;
	const proxiedGet = $.get;

	interceptPost("viewLoginAreaAction", args => {
		const callback = args[1];
		args[1] = (html: any) => {
			callback(html);
			const captchaValueElement = document.getElementById("txtCaptcha") as HTMLInputElement;
			const captchaInputElement = document.getElementById("txtInput") as HTMLInputElement;
			captchaValueElement.value = "FFFFFF";
			captchaInputElement.value = "FFFFFF";
			(window as any).DrawLoginCaptcha = () => {};
			(window as any).validateLoginCaptcha = () => true;
			captchaValueElement.style.display = "none";
			captchaInputElement.style.display = "none";
			(document.querySelector(".captcharefresh") as HTMLElement).style.display = "none";
		}
	});
	interceptPost("viewPasswordRecoveryArea", args => {
		const callback = args[1];
		args[1] = (html: any) => {
			callback(html);
			const captchaInputElement = document.getElementById("dText") as HTMLInputElement;
			const captchaValueElement = document.getElementById("captaText") as HTMLInputElement;
			captchaValueElement.value = "FFFFFF";
			captchaInputElement.value = "FFFFFF";
			(window as any).Captcha = () => {};
			captchaValueElement.style.display = "none";
			captchaInputElement.style.display = "none";
			(document.getElementById("captchaRef") as HTMLElement).style.display = "none";
		}
	});
	interceptPost("login.action", args => {
		const callback = args[2];
		args[2] = (data: any) => {
			if (!data.exception && data.checkmsg === "success") {
				window.localStorage.setItem("loginData", btoa(JSON.stringify(args[1])));
			}

			callback(data);
			(document.getElementById("txtInput") as HTMLInputElement).value = "FFFFFF";
		};
	});
	interceptPost("changePassword.action", args => {
		const callback = args[2];
		args[2] = (data: any) => {
			callback(data);
			(document.getElementById("txtInput") as HTMLInputElement).value = "FFFFFF";
		};
	});
	interceptGet("viewRegistrationAreaAction", args => {
		const callback = args[1];
		args[1] = (html: any) => {
			callback(html);
			const captchaInputElement = document.getElementById("regInputCaptcha") as HTMLInputElement;
			const captchaValueElement = document.getElementById("regCaptcha") as HTMLInputElement;
			captchaValueElement.value = "FFFFFF";
			captchaInputElement.value = "FFFFFF";
			(document.querySelector("#registrationForm > div > div:nth-child(5) > div:nth-child(3)") as HTMLElement).style.display = "none";
			(document.querySelector("#registrationForm > div > div:nth-child(5) > div:nth-child(4)") as HTMLElement).style.display = "none";
			(document.querySelector("#registrationForm > div > div:nth-child(5) > div:nth-child(5)") as HTMLElement).style.display = "none";
			(window as any).DrawRegistrationCaptcha = () => {};
			(window as any).validateRegistrationCaptcha = () => true;
		}
	});
	interceptGet("logout", args => {
		window.localStorage.removeItem("loginData");
	});
	interceptGet("viewChangePasswordAction", args => {
		const callback = args[1];
		args[1] = (html: any) => {
			callback(html);
			const captchaValueElement = document.getElementById("txtCaptcha") as HTMLInputElement;
			const captchaInputElement = document.getElementById("txtInput") as HTMLInputElement;
			captchaValueElement.value = "FFFFFF";
			captchaInputElement.value = "FFFFFF";
			(window as any).DrawLoginCaptcha = () => {};
			captchaValueElement.style.display = "none";
			captchaInputElement.style.display = "none";
			(document.querySelector(".captcharefresh") as HTMLElement).style.display = "none";
		}
	});

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
