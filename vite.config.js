import { defineConfig } from "vite";
import Userscript from "vite-userscript-plugin";
import fs from "fs";
import path from "path";
import { compile } from "sass";
import postcss from "postcss";
import url from "postcss-url";

const name = "PT站M-Team的高贵樱花粉、云朵白主题";
const port = 48966;

const r = fs.readFileSync("node_modules/vite-userscript-plugin/dist/index.js", "utf8");
if (r.includes("minify: !isBuildWatch") || r.includes("const sanitizedFilename = output.sanitizeFileName(fileName);")) {
	fs.writeFileSync(
		"node_modules/vite-userscript-plugin/dist/index.js",
		r
			.replace(/minify: !isBuildWatch/g, "minify: false")
			.replace("const sanitizedFilename = output.sanitizeFileName(fileName);", "const sanitizedFilename = 'mteam-theme';"),
	);
	console.warn("请重新运行。");
	process.exit(0);
}

export default defineConfig((config) => {
	return {
		plugins: [
			{
				name: "scss-to-css",
				async buildStart() {
					const file = "src/styles/theme/index.scss";
					const fullPath = fs.realpathSync(file);
					const outputFile = fullPath.replace(".scss", ".css");
					const result = compile(fullPath, {
						loadPaths: [path.dirname(file)],
						style: "expanded",
					});

					const inlineResult = await postcss(
						url({
							url: "inline",
						}),
					).process(result.css, {
						from: outputFile,
						to: outputFile,
					});

					fs.writeFileSync(outputFile, inlineResult.css);
				},
			},
			Userscript({
				entry: "src/index.js",
				header: {
					name: name,
					namespace: "https://mteam-theme-sakura.github.io",
					description: "非常高贵的 —— 又高又贵的 M-Team 主题，你问我为什么高贵？你猜猜？",
					license: "WTFPL",
					// homepage: "https://m-team.syzx.me/",
					supportURL: "https://github.com/mteam-theme-sakura/theme/issues",
					version: new Date().toLocaleString().replace(/[/:]/g, "").replace(" ", "."),
					author: "Dark495",
					icon: "https://m-team.syzx.me/assets/img/wtf.png",
					match: ["https://kp.m-team.cc/*", "https://xp.m-team.cc/*", "https://zp.m-team.io/*"],
					grant: ["GM_addStyle"],
				},
				server: {
					port: port,
				},
			}),
			{
				name: "rename",
				closeBundle() {
					fs.readdirSync("dist").map((file) => {
						if (file.includes(name)) {
							const newName = name.replace(name, "mteam-theme");
							fs.renameSync(`dist/${file}`, `dist/${newName}`);
						}
					});
				},
			},
		],
	};
});
