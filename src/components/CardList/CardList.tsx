import { Pagination } from "../Pagination/Pagination";
import { Card } from "./Card/Card";
import "./cardList.css";

export const CardList = () => {
	return (
		<div className="cardList">
			<h1 className="cardList__title">Recent Posts</h1>
			<div className="cardList__postsContainer">
				<Card />
				<Card />
				<Card />
				<Card />
			</div>
			<Pagination />
		</div>
	);
};
