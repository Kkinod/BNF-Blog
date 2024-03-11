import { Pagination } from "../ATOMIC_DESIGN/molecules/Pagination/Pagination";
import { Card } from "./Card/Card";
import { type Posts } from "@/app/api/posts/route";
import "./cardList.css";

interface PromiseGetData {
	posts: Posts[];
	count: number;
}

const getData = async (page: number): Promise<PromiseGetData> => {
	const res = await fetch(`http://localhost:3000/api/posts?page=${page}`, {
		cache: "no-store",
	});

	if (!res.ok) {
		throw new Error("Failed");
	}

	const data = (await res.json()) as PromiseGetData;
	return data;
};

export const CardList = async ({ page }: { page: number }) => {
	const { posts, count } = await getData(page);
	console.log("posts", posts);

	const POST_PER_PAGE = 2;

	const hasPrev = POST_PER_PAGE * (page - 1) > 0;
	const hasNext = POST_PER_PAGE * (page - 1) + POST_PER_PAGE < count;

	return (
		<div className="cardList">
			<h1 className="cardList__title">Recent Posts</h1>
			<div className="cardList__postsContainer">
				{posts?.map((item) => <Card key={item._id} item={item} />)}
			</div>
			<Pagination page={page} hasPrev={hasPrev} hasNext={hasNext} />
		</div>
	);
};
