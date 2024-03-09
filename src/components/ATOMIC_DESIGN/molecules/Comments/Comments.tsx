import Link from "next/link";
import "./comments.css";
import Image from "next/image";

export const Comments = () => {
	const status = "authenticate";

	return (
		<div className="comments__container">
			<h1 className="comment__title"></h1>
			{status === "authenticate" ? (
				<div className="comment__write">
					<textarea placeholder="write a comment..." className="comment__input" />
					<button className="comment__button">Send</button>
				</div>
			) : (
				<Link href="/" className="comment__login">
					Login to write a comment
				</Link>
			)}
			<div className="comments__list">
				<div className="comment">
					<div className="comment__user">
						<Image src="/p1.jpeg" alt="" width={50} height={50} className="comment__image" />
						<div className="comment__userInfo">
							<span className="comment__username">John Doe</span>
							<span className="comment__date">01.01.2023</span>
						</div>
					</div>
					<p className="comment_description">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio tenetur, nisi
						beatae suscipit temporibus adipisci fugiat accusantium nostrum laborum molestias ipsam
						dolores at facilis voluptatibus dolor rerum aliquid dicta voluptatum!
					</p>
				</div>
				<div className="comment">
					<div className="comment__user">
						<Image src="/p1.jpeg" alt="" width={50} height={50} className="comment__image" />
						<div className="comment__userInfo">
							<span className="comment__username">John Doe</span>
							<span className="comment__date">01.01.2023</span>
						</div>
					</div>
					<p className="comment_description">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio tenetur, nisi
						beatae suscipit temporibus adipisci fugiat accusantium nostrum laborum molestias ipsam
						dolores at facilis voluptatibus dolor rerum aliquid dicta voluptatum!
					</p>
				</div>
				<div className="comment">
					<div className="comment__user">
						<Image src="/p1.jpeg" alt="" width={50} height={50} className="comment__image" />
						<div className="comment__userInfo">
							<span className="comment__username">John Doe</span>
							<span className="comment__date">01.01.2023</span>
						</div>
					</div>
					<p className="comment_description">
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Distinctio tenetur, nisi
						beatae suscipit temporibus adipisci fugiat accusantium nostrum laborum molestias ipsam
						dolores at facilis voluptatibus dolor rerum aliquid dicta voluptatum!
					</p>
				</div>
			</div>
		</div>
	);
};
