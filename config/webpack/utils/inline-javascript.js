export const inlineJavascript = code => `data:text/javascript;base64,${Buffer.from(code).toString("base64")}`;
