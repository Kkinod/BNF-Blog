import { getTranslations } from "@/shared/utils/translations";
import { i18nConfig } from "@/i18n/settings";
import "./featured.css";

export const Featured = async ({ locale = i18nConfig.defaultLocale }: { locale?: string }) => {
	const t = await getTranslations(locale);

	return (
		<div className="featured">
			<h1 className="featured__title">
				<b>{t("heroTextHey", { defaultValue: "Hey, kkindo here!" })}</b>
				{t("heroTextInformation", {
					defaultValue: "Discover my stories and road to the specialist",
				})}
			</h1>
		</div>
	);
};
