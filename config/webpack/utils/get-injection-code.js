module.exports.getInjectionCode = (code, front) => {
	const escapeSequences = [
		["\b", "\\b"],
		["\f", "\\f"],
		["\n", "\\n"],
		["\r", "\\r"],
		["\t", "\\t"],
		["\v", "\\v"]
	];
	let finalCode = code.replaceAll("`","\\`");

	for (const escapeSequence of escapeSequences) {
		finalCode = finalCode
			.replaceAll(escapeSequence[1], "\\" + escapeSequence[1])
			.replaceAll(escapeSequence[0], escapeSequence[1]);
	}

	const concatenationCode = front
		? "t.innerHTML=i+t.innerHTML"
		: "t.innerHTML+=i";

	return `(()=>{let e=new MutationObserver(()=>{let t=document.querySelector("head > script:nth-child(54)");if(t){let i=\`(()=>{${finalCode}})();\`;${concatenationCode},e.disconnect()}});e.observe(document,{childList:!0,subtree:!0})})();`;
};
