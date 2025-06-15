type InterceptJqueryAjaxCallback = (args: any) => void;

interface InterceptJqueryEntry {
	url: string;
	callback: InterceptJqueryAjaxCallback;
};

const postIntercepts: InterceptJqueryEntry[] = [];
const getIntercepts: InterceptJqueryEntry[] = [];

document.addEventListener("DOMContentLoaded", () => {
	const proxiedPost = $.post;
	const proxiedGet = $.get;

	$.post = function() {
		for (const { url, callback } of postIntercepts) {
			if (arguments[0].endsWith(url)) {
				callback(arguments);
			}
		}

		return proxiedPost.apply(this, Array.from(arguments) as any);
	};
	$.get = function() {
		for (const { url, callback } of getIntercepts) {
			if (arguments[0].endsWith(url)) {
				callback(arguments);
			}
		}

		return proxiedGet.apply(this, Array.from(arguments) as any);
	};
});

export function interceptPost(url: string, callback: InterceptJqueryAjaxCallback) {
	postIntercepts.push({ url, callback });
};

export function interceptGet(url: string, callback: InterceptJqueryAjaxCallback) {
	getIntercepts.push({ url, callback });
};
