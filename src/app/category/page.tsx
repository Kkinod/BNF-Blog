import { notFound } from "next/navigation";
import { CardList } from "@/components/organisms/CardList/CardList";
import { Menu } from "@/components/organisms/Menu/Menu";
import { getDataCategoriesServer } from "@/utils/services/categories/request";
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
			<h1 className="categoryPage__title" data-category={cat}>
				{cat}
			</h1>
			<div className="categoryPage__content">
				<CardList page={page} cat={cat} />
				<Menu />
			</div>
		</div>
	);
};

export default CategoryPage;
