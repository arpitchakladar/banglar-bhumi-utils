module.exports.getInjectionCode = (code, front) => {
	let finalCode = code
		.replaceAll("\\", "\\\\")
		.replaceAll("`","\\`")
		.replaceAll("${", "\\${");

	const concatenationCode = front
		? "t.innerHTML=i+t.innerHTML"
		: "t.innerHTML+=i";

	return `(()=>{let e=new MutationObserver(()=>{let t=document.querySelector("head > script:nth-child(54)");if(t){let i=\`${finalCode}\`;${concatenationCode},e.disconnect()}});e.observe(document,{childList:!0,subtree:!0})})();`;
};
