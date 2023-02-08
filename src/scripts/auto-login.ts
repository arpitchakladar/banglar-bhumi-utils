const proxiedPost = $.post;

let loginData: any | null = null;

$.post = function() {
	if (arguments[0].endsWith("login.action")) {
		const callback = arguments[2];
		arguments[2] = (data: any) => {
			if (!data.exception && data.checkmsg === "success") {
				loginData = arguments[1];
			}
			callback(data);
		};
	}

	return proxiedPost.apply(this, Array.from(arguments) as any);
};

setInterval(() => {
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
