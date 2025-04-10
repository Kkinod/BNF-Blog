import { initTranslations } from "@/i18n/server";

export async function getTranslations(locale: string = "pl") {
	const { t } = await initTranslations(locale, ["translation"]);
	return t;
}
