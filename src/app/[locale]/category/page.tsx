import { notFound } from "next/navigation";
import { CardList } from "@/shared/components/organisms/CardList/CardList";
import { Menu } from "@/shared/components/organisms/Menu/Menu";
import { getDataCategoriesServer } from "@/features/blog/api/categories/request";
import "./categoryPage.css";

interface SearchParams {
	page: string;
	cat: string;
}

const CategoryPage = async ({ searchParams }: { searchParams: SearchParams }) => {
	const page = parseInt(searchParams.page) || 1;
	const { cat } = searchParams;
	const categories = await getDataCategoriesServer();
	const categoryExists = categories.some((category) => category.slug === cat);

	if (!categoryExists) {
		notFound();
	}

	return (
		<div className="categoryPage">
			<h1
				className="categoryPage__title"
				data-category={cat}
				style={{ "--category-attr": `var(--category-${cat})` } as React.CSSProperties}
			>
				{cat}
			</h1>
			<div className="content">
				<CardList page={page} cat={cat} />
				<Menu />
			</div>
		</div>
	);
};

export default CategoryPage;
