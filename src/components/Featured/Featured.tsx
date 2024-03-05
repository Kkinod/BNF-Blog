import Image from "next/image";
import "./featured.css";

export const Featured = () => {
	return (
		<div className="featured">
			<h1 className="featured__title">
				<b>Hey, kkindo here!</b> Discover my stories and road to the specialist
			</h1>
			<div className="post">
				<div className="post__imgContainer">
					<Image src="/p1.jpeg" alt="Ocean View" className="post__image" fill></Image>
				</div>
				<div className="post__textContainer">
					<h1 className="post__title">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Nisi quae repellat soluta velit
						delectus fuga officia.
					</h1>
					<p className="post__description">
						Lorem ipsum dolor sit amet consectetur adipisicing elit. Corporis dolorum odio nisi,
						explicabo nulla nihil facere neque id dolor repellendus veritatis totam in ullam
						voluptatibus laboriosam rem, sapiente maiores natus.
					</p>
					<button className="post__button--readMore">Read More</button>
				</div>
			</div>
		</div>
	);
};
