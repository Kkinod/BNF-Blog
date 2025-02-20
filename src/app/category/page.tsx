import { CardList } from "@/components/organisms/CardList/CardList";
import { Menu } from "@/components/organisms/Menu/Menu";
import "./categoryPage.css";

interface SearchParams {
	page: string;
	cat: string;
}

const CategoryPage = ({ searchParams }: { searchParams: SearchParams }) => {
	const page = parseInt(searchParams.page) || 1;
	const { cat } = searchParams;

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
