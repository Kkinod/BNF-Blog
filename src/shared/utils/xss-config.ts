import { type IFilterXSSOptions, type IWhiteList } from "xss";

export const extendedWhiteList: IWhiteList = {
	a: ["target", "href", "title", "rel"],
	abbr: ["title"],
	address: [],
	area: ["shape", "coords", "href", "alt"],
	article: [],
	aside: [],
	audio: ["autoplay", "controls", "loop", "preload", "src"],
	b: [],
	bdi: ["dir"],
	bdo: ["dir"],
	big: [],
	blockquote: ["cite", "class", "style"],
	br: [],
	caption: [],
	center: [],
	cite: [],
	code: ["class", "spellcheck", "style"],
	col: ["align", "valign", "span", "width"],
	colgroup: ["align", "valign", "span", "width"],
	dd: [],
	del: ["datetime"],
	details: ["open"],
	div: ["class", "spellcheck", "contenteditable", "data-gramm", "style"],
	dl: [],
	dt: [],
	em: ["class", "style"],
	figcaption: [],
	figure: [],
	font: ["color", "size", "face"],
	footer: [],
	h1: ["class", "style"],
	h2: ["class", "style"],
	h3: ["class", "style"],
	h4: ["class", "style"],
	h5: ["class", "style"],
	h6: ["class", "style"],
	header: [],
	hr: [],
	i: ["class", "style"],
	img: ["src", "alt", "title", "width", "height", "class", "style"],
	ins: ["datetime"],
	li: ["class", "style"],
	mark: [],
	nav: [],
	ol: ["class", "style"],
	p: ["class", "style"],
	pre: ["class", "spellcheck", "style", "data-language"],
	s: ["class", "style"],
	section: [],
	small: [],
	span: ["class", "style"],
	sub: [],
	summary: [],
	sup: [],
	strong: ["class", "style"],
	strike: ["class", "style"],
	table: ["width", "border", "align", "valign", "class", "style"],
	tbody: ["align", "valign"],
	td: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
	tfoot: ["align", "valign"],
	th: ["width", "rowspan", "colspan", "align", "valign", "class", "style"],
	thead: ["align", "valign"],
	tr: ["rowspan", "align", "valign", "class", "style"],
	tt: [],
	u: ["class", "style"],
	ul: ["class", "style"],
	video: ["autoplay", "controls", "loop", "preload", "src", "height", "width", "class", "style"],

	iframe: [
		"src",
		"frameborder",
		"allowfullscreen",
		"width",
		"height",
		"allow",
		"title",
		"style",
		"class",
	],
};

export const xssOptions: IFilterXSSOptions = {
	whiteList: extendedWhiteList,
	stripIgnoreTag: true,
	stripIgnoreTagBody: false,
	css: {
		whiteList: {
			"background-color": true,
			color: true,
			"text-align": true,
			"font-size": true,
			"line-height": true,
			"white-space": true,
			padding: true,
			margin: true,
			display: true,
			"font-family": true,
			"border-left": true,
			"border-radius": true,
			"text-decoration": true,
			"font-weight": true,
			"font-style": true,
			"box-shadow": true,
			overflow: true,
		},
	},
	onTag: function (tag: string, html: string) {
		if (tag === "pre" || tag === "code") {
			return html;
		}
		if (tag === "strong" || tag === "em" || tag === "u" || tag === "s" || tag === "blockquote") {
			return html;
		}
		if (tag === "iframe") {
			if (html.includes("youtube.com") || html.includes("vimeo.com")) {
				return html;
			}
		}
		return undefined;
	},
	onTagAttr: function (
		tag: string,
		name: string,
		value: string,
		_isWhiteAttr: boolean,
	): string | undefined {
		if (name === "class" && value.includes("ql-")) {
			return name + '="' + value + '"';
		}

		if (name === "style") {
			return name + '="' + value + '"';
		}

		if (tag === "iframe" && name === "src") {
			if (
				value.startsWith("https://www.youtube.com/") ||
				value.startsWith("https://youtube.com/") ||
				value.startsWith("https://www.youtube-nocookie.com/") ||
				value.startsWith("https://player.vimeo.com/")
			) {
				return name + '="' + value + '"';
			}
		}
		return undefined;
	},
};
