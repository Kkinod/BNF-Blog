import Link from "next/link";
import Image from "next/image";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { getTranslations } from "@/shared/utils/translations";
import { getLocalizedRoutes } from "@/shared/utils/routes";
import { i18nConfig } from "@/i18n/settings";
import { labels } from "@/shared/utils/labels";
import "./categoryList.css";

export const CategoryList = async ({ locale = i18nConfig.defaultLocale }: { locale?: string }) => {
	const data = await getDataCategoriesServer();
	const localizedRoutes = getLocalizedRoutes(locale);
	const t = await getTranslations(locale);

	return (
		<div className="categoryList">
			<h1 className="categoryList__title">
				{t("categoryList.categories", { defaultValue: labels.categoryList.categories })}
			</h1>
			<div className="categoryList__categoriesContainer">
				{data?.map((item) => (
					<Link
						href={localizedRoutes.category(item.slug)}
						className={`category category--${item.slug}`}
						key={item.id}
					>
						{item.img && (
							<Image src={item.img} alt="" width={32} height={32} className={`category__image`} />
						)}
						{t(`categories.${item.slug}`, { defaultValue: item.title })}
					</Link>
				))}
			</div>
		</div>
	);
};
