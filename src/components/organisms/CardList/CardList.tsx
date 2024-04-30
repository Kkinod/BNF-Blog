import { Pagination } from "../../molecules/Pagination/Pagination";
import { Card } from "../../molecules/Card/Card";
import { POST_PER_PAGE } from "@/app/api/posts/route";
import { getDataCardList } from "@/utils/services/cardList/request";

import "./cardList.css";

interface CardList {
	page: number;
	cat?: string;
}

export const CardList = async ({ page, cat }: CardList) => {
	const { posts, count } = await getDataCardList(page, cat);

	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

	return (
		<div className="cardList">
			<h1 className="cardList__title">Recent Posts</h1>
			<div className="cardList__postsContainer">
				{posts?.map((item) => <Card key={item.id} item={item} />)}
			</div>
			<Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
		</div>
	);
};
