import { CardList } from "@/components/organisms/CardList/CardList";
import { CategoryList } from "@/components/organisms/CategoryList/CategoryList";
import { Featured } from "@/components/organisms/Featured/Featured";
import { Menu } from "@/components/organisms/Menu/Menu";

interface SearchParams {
	page: string;
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
	const page = parseInt(searchParams.page) || 1;

	return (
		<div className="container">
			<Featured />
			<CategoryList />
			<div className="content">
				<CardList page={page} />
				<Menu />
			</div>
		</div>
	);
}
