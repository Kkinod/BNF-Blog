"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { handleSubmitComment, useComments } from "@/utils/services/comments/request";
import "./comments.css";

export const Comments = ({ postSlug }: { postSlug: string }) => {
	const [desc, setDesc] = useState<string>("");
	const { status } = useSession();

	const { data, isLoading, mutate } = useComments(postSlug);

	return (
		<div className="comments__container">
			<h1 className="comment__title"></h1>
			{status === "authenticated" ? (
				<div className="comment__write">
					<textarea
						placeholder="write a comment..."
						className="comment__input"
						onChange={(e) => setDesc(e.target.value)}
					/>
					<button
						className="comment__button"
						onClick={() => {
							handleSubmitComment({ mutate, desc, postSlug }).catch(console.error);
						}}
					>
						Send
					</button>
				</div>
			) : (
				<Link href="/" className="comment__login">
					Login to write a comment
				</Link>
			)}
			{isLoading
				? "Loading..."
				: data?.map((item) => (
						<div className="comments__list" key={item.id}>
							<div className="comment">
								<div className="comment__user">
									{item?.user?.image && (
										<Image
											src={item.user.image}
											alt="user image"
											width={50}
											height={50}
											className="comment__image"
										/>
									)}
									<div className="comment__userInfo">
										<span className="comment__username">{item.user.name}</span>
										<span className="comment__date">{item.createdAt.substring(0, 10)}</span>
									</div>
								</div>
								<p className="comment_description">{item.desc}</p>
							</div>
						</div>
					))}
		</div>
	);
};
