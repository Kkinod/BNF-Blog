import { CardList } from "@/components/organisms/CardList/CardList";
import { Menu } from "@/components/organisms/Menu/Menu";
import "./blogPage.css";

interface SearchParams {
	page: string;
	cat: string;
}

const BlogPage = ({ searchParams }: { searchParams: SearchParams }) => {
	const page = parseInt(searchParams.page) || 1;
	const { cat } = searchParams;

	return (
		<div className="blogPage">
			<h1 className="blogPage__title">{cat} Blog</h1>
			<div className="blogPage__content">
				<CardList page={page} cat={cat} />
				<Menu />
			</div>
		</div>
	);
};

export default BlogPage;
