declare function loadKhatian(): void;

document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;

	$.post = function() {
		if (arguments[0].startsWith("khDetailsAction_LandInfo.action")) {
			const callback = arguments[2];
			arguments[2] = (data: any) => {
				callback(data);
				const tableElement = document.querySelector("#khdetails > table > tbody > tr > td:nth-child(1) > div:nth-child(5) > table > tbody") as HTMLElement | null;

				if (tableElement) {
					tableElement.style.height = "auto";
					tableElement.style.width = "100%";
				}
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	}
});
