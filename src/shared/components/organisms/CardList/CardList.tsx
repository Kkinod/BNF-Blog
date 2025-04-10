import { Pagination } from "../../molecules/Pagination/Pagination";
import { Card } from "../Card/Card";
import { POST_PER_PAGE } from "@/config/constants";
import { getDataCardList } from "@/features/blog/api/cardList/request";
import { i18nConfig } from "@/i18n/settings";

interface CardList {
	page: number;
	cat?: string;
	locale?: string;
}

export const CardList = async ({ page, cat, locale = i18nConfig.defaultLocale }: CardList) => {
	const { posts, count } = await getDataCardList(page, cat);

	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

	const maxPage = Math.ceil(count / POST_PER_PAGE);

	return (
		<div className="my-15 max-w-[858px] flex-grow-5 lg:max-w-none">
			<div className="cardList__postsContainer">
				{posts.map((item) => (
					<Card key={item.id} item={item} locale={locale} />
				))}
			</div>
			<Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} maxPage={maxPage} />
		</div>
	);
};
