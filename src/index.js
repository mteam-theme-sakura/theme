import themeStyle from "./styles/theme/index.css?raw";

const waitForElement = (selector, timeout = 5000) => {
	return new Promise((resolve, reject) => {
		const start = Date.now();

		const check = () => {
			const el = document.querySelector(selector);
			if (el) return resolve(el);
			if (Date.now() - start > timeout) return reject(new Error("Timeout"));
			requestAnimationFrame(check);
		};

		check();
	});
};

waitForElement('img[alt="LOGO"]').then((el) => {
	const nextDiv = el?.parentElement?.nextElementSibling;
	if (nextDiv && nextDiv.tagName === "DIV") {
		const select = document.createElement("select");

		select.style.background = "transparent";
		select.style.border = "none";
		select.style.color = "rgb(0, 0, 0)";
		select.style.fontSize = "16px";
		select.style.padding = "3px";
		select.style.outline = "none";
		select.style.display = "inline-block";
		select.style.position = "relative";
		select.style.top = "2px";

		const options = {
			default: "默认蓝",
			sakura: "樱花粉",
			cloud: "云朵白",
		};
		const optionsEl = Object.entries(options).map(([value, text]) => {
			const option = document.createElement("option");
			option.value = value;
			option.textContent = text;
			return option;
		});

		select.append(...optionsEl);
		nextDiv.insertBefore(select, nextDiv.childNodes[0]);

		select.addEventListener("change", () => {
			document.body.setAttribute("data-theme", select.value);
			localStorage.setItem("mteam-theme", select.value);
		});
		select.value = localStorage.getItem("mteam-theme") || "default";
	}
});

waitForElement("body").then(() => {
	document.body.setAttribute("data-theme", localStorage.getItem("mteam-theme") || "default");
});

GM_addStyle(themeStyle);
