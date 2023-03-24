module.exports.getInjectionCode = code => {
	const escapeSequences = [["\b", "\\b"],
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

	return `(()=>{const o=new MutationObserver(()=>{let t=document.querySelector("head > script:nth-child(54)");if(t){let e=\`(()=>{${finalCode}})();\`;null==t.getAttribute("data-replaced")?(t.innerHTML=e,t.setAttribute("data-replaced","")):t.innerHTML+=e,o.disconnect()}});o.observe(document,{childList:!0,subtree:!0});})();`;
};
