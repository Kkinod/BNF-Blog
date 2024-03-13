import { CardList } from "@/components/CardList/CardList";
import { Menu } from "@/components/Menu/Menu";
import "./blogPage.css";

const BlogPage = ({ searchParams }: { searchParams: string }) => {
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
