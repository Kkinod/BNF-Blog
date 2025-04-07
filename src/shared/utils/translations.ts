import { initTranslations } from "@/i18n";

export async function getTranslations(locale: string = "pl") {
	const { t } = await initTranslations(locale, ["translation"]);
	return t;
}
