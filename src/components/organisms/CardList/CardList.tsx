import { Pagination } from "../../molecules/Pagination/Pagination";
import { Card } from "../../molecules/Card/Card";
import { POST_PER_PAGE } from "@/app/api/posts/route";
import { getDataCardList } from "@/utils/services/cardList/request";

interface CardList {
	page: number;
	cat?: string;
}

export const CardList = async ({ page, cat }: CardList) => {
	const { posts, count } = await getDataCardList(page, cat);

	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

	const maxPage = Math.ceil(count / POST_PER_PAGE);

	return (
		// <div className="flex-grow-5 my-15 flex flex-col items-center">
		<div className="flex-grow-5 my-15">
			<div className="cardList__postsContainer">
				{posts?.map((item) => <Card key={item.id} item={item} />)}
			</div>
			<Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} maxPage={maxPage} />
		</div>
	);
};
