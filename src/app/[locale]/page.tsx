import { CardList } from "@/shared/components/organisms/CardList/CardList";
import { CategoryList } from "@/shared/components/organisms/CategoryList/CategoryList";
import { Featured } from "@/shared/components/organisms/Featured/Featured";
import { Menu } from "@/shared/components/organisms/Menu/Menu";

interface SearchParams {
	page: string;
}

export default function Home({ searchParams }: { searchParams: SearchParams }) {
	const page = parseInt(searchParams.page) || 1;

	return (
		<div>
			<Featured />
			<div className="content">
				<CardList page={page} />
				<Menu />
			</div>
			<CategoryList />
		</div>
	);
}
