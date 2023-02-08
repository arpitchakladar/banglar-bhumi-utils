module.exports = code => {
	const base64 = Buffer.from(code).toString("base64");
	return `data:text/javascript;base64,${base64}`;
};
