"use client";

import Link from "next/link";
import Image from "next/image";
import useSWR from "swr";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { type User } from "@/app/posts/[slug]/page";

import "./comments.css";

interface Comment {
	createdAt: string;
	desc: string;
	id: string;
	postSlug: string;
	user: User;
	userEmail: string;
	message: string;
}

interface ErrorResponse {
	message: string;
}

const fetcher = async (url: string): Promise<Comment[]> => {
	const res: Response = await fetch(url);

	const data = (await res.json()) as Comment[];

	if (!res.ok) {
		const errorData = (await res.json()) as ErrorResponse;
		throw new Error(errorData.message);
	}

	return data;
};

export const Comments = ({ postSlug }: { postSlug: string }) => {
	const [desc, setDesc] = useState<string>("");
	const { status } = useSession();

	const { data, mutate, isLoading } = useSWR<Comment[]>(
		`http://localhost:3000/api/comments?postSlug=${postSlug}`,
		fetcher,
	);

	const handleSubmit = async () => {
		fetch("/api/comments", {
			method: "POST",
			body: JSON.stringify({ desc, postSlug }),
		})
			.then(() => mutate())
			.catch(console.error);
	};

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
							handleSubmit().catch(console.error);
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
										<span className="comment__date">{item.createdAt}</span>
									</div>
								</div>
								<p className="comment_description">{item.desc}</p>
							</div>
						</div>
					))}
		</div>
	);
};
