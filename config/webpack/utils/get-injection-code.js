const insertAtIndex = (str, substring, index) => str.slice(0, index) + substring + str.slice(index);

module.exports.getInjectionCode = (code, front) => {
	let finalCode = code
		.replaceAll("\\", "\\\\")
		.replaceAll("`","\\`")
		.replaceAll("${", "\\${");

	let i = 0;

	while (true) {
		i = finalCode.indexOf("chrome.runtime", i);

		if (i < 0) {
			break;
		}

		finalCode = insertAtIndex(finalCode, "\"${", i);
		i = finalCode.indexOf(")", i) + 1;

		if (i <= 0) {
			break;
		}

		finalCode = insertAtIndex(finalCode, "}\"", i);
	}

	const concatenationCode = front
		? "t.innerHTML=i+t.innerHTML"
		: "t.innerHTML+=i";

	return `(()=>{let e=new MutationObserver(()=>{let t=document.querySelector("head > script:nth-child(54)");if(t){let i=\`${finalCode}\`;${concatenationCode},e.disconnect()}});e.observe(document,{childList:!0,subtree:!0})})();`;
};
