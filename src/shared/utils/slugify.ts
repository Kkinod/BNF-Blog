/**
 * Converts a string to a URL-friendly slug
 * Removes diacritics, converts to lowercase, and replaces spaces with hyphens
 */
export function slugify(str: string): string {
	const iMap: { [key: string]: string } = {
		ð: "d",
		ı: "i",
		Ł: "L",
		ł: "l",
		ø: "o",
		ß: "ss",
		ü: "ue",
	};

	const iRegex = new RegExp(Object.keys(iMap).join("|"), "g");
	return str
		.replace(iRegex, (m) => iMap[m])
		.normalize("NFD")
		.replace(/[\u0300-\u036f]/g, "")
		.toLowerCase()
		.trim()
		.replace(/[^\w\s-]/g, "")
		.replace(/[\s_-]+/g, "-")
		.replace(/^-+|-+$/g, "");
}
