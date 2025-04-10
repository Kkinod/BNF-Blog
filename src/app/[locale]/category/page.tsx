import { notFound } from "next/navigation";
import { CardList } from "@/shared/components/organisms/CardList/CardList";
import { Menu } from "@/shared/components/organisms/Menu/Menu";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import { getTranslations } from "@/shared/utils/translations";
import "./categoryPage.css";

interface SearchParams {
	page: string;
	cat: string;
}

const CategoryPage = async ({
	searchParams,
	params,
}: {
	searchParams: SearchParams;
	params: { locale: string };
}) => {
	const page = parseInt(searchParams.page) || 1;
	const { cat } = searchParams;
	const { locale } = params;
	const categories = await getDataCategoriesServer();
	const categoryExists = categories.some((category) => category.slug === cat);
	const t = await getTranslations(locale);

	if (!categoryExists) {
		notFound();
	}

	const category = categories.find((category) => category.slug === cat);
	const categoryTitle = category ? category.title : cat;

	return (
		<div className="categoryPage">
			<h1
				className="categoryPage__title"
				data-category={cat}
				style={{ "--category-attr": `var(--category-${cat})` } as React.CSSProperties}
			>
				{t(`categories.${cat}`, { defaultValue: categoryTitle })}
			</h1>
			<div className="content">
				<CardList page={page} cat={cat} locale={locale} />
				<Menu locale={locale} />
			</div>
		</div>
	);
};

export default CategoryPage;
