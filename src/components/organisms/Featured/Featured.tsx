import { labels } from "@/views/labels";
import "./featured.css";

export const Featured = () => {
	return (
		<div className="featured">
			<h1 className="featured__title">
				<b>{labels.heroTextHey}</b>
				{labels.heroTextInformation}
			</h1>
		</div>
	);
};
