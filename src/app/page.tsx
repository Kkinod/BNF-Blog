import { CardList } from "@/components/CardList/CardList";
import { CategoryList } from "@/components/CategoryList/CategoryList";
import { Featured } from "@/components/Featured/Featured";
import { Menu } from "@/components/Menu/Menu";

export default function Home() {
	return (
		<div className="container">
			<Featured />
			<CategoryList />
			<div className="content">
				<CardList />
				<Menu />
			</div>
		</div>
	);
}
