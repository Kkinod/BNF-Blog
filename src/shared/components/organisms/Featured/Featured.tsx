import { getTranslations } from "@/shared/utils/translations";
import { i18nConfig } from "@/i18n/settings";
import "./featured.css";
import { labels } from "@/shared/utils/labels";

export const Featured = async ({ locale = i18nConfig.defaultLocale }: { locale?: string }) => {
	const t = await getTranslations(locale);

	return (
		<div className="featured">
			<h1 className="featured__title">
				<b>
					{t("featured.heroTextHey", {
						defaultValue: labels.featured.heroTextHey,
					})}
				</b>
				{t("featured.heroTextInformation", {
					defaultValue: labels.featured.heroTextInformation,
				})}
			</h1>
		</div>
	);
};
