import Image from "next/image";
import { Menu } from "@/components/Menu/Menu";
import { Comments } from "@/components/ATOMIC_DESIGN/molecules/Comments/Comments";
import "./singlePage.css";

const SinglePage = () => {
	return (
		<div className="singlePage">
			<div className="singlePage__infoContainer">
				<div className="singlePage__textContainer">
					<h1 className="singlePage__textTitle">
						Lorem ipsum dolor sit amet consectetur, adipisicing elit. Saepe, quam ipsa.
					</h1>
					<div className="text__userContainer">
						<div className="text__userImageContainer">
							<Image src="/p1.jpeg" alt="" fill className="singlePage__imageAvatar" />
						</div>
						<div className="text__userTextContainer">
							<span className="text__userName">John Doe</span>
							<span className="text__userDate">03.03.2024</span>
						</div>
					</div>
				</div>
				<div className="singlePage__imageContainer">
					<Image src="/p1.jpeg" alt="" fill className="singlePage__image" />
				</div>
			</div>
			<div className="singlePage__content">
				<div className="content__post">
					<div className="content__postDescription">
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam libero odio,
							architecto saepe voluptatum harum omnis officiis unde deleniti magnam quam nemo qui
							mollitia, reiciendis ab expedita eos magni quos.
						</p>
						<h2>Lorem ipsum dolor sit amet con</h2>
						<p>
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquam libero odio,
							architecto saepe voluptatum harum omnis officiis unde deleniti magnam quam nemo qui
							mollitia, reiciendis ab expedita eos magni quos.
						</p>
					</div>
					<div className="content__comment">
						<Comments />
					</div>
				</div>
				<Menu />
			</div>
		</div>
	);
};

export default SinglePage;
