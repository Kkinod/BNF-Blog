"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { UserRole } from "@prisma/client";
import { toast } from "sonner";
import { handleSubmitComment, useComments } from "@/utils/services/comments/request";
import { labels } from "@/views/labels";
import { COMMENT_LIMITS } from "@/config/constants";
import "./comments.css";

export const Comments = ({ postSlug }: { postSlug: string }) => {
	const [desc, setDesc] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { status, data: session } = useSession();

	const { data, isLoading, mutate } = useComments(postSlug);

	const isAdmin = session?.user?.role === UserRole.ADMIN;

	const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		const text = e.target.value;
		if (text.length <= COMMENT_LIMITS.MAX_LENGTH) {
			setDesc(text);
		}
	};

	const handleSubmit = () => {
		if (!desc.trim()) {
			toast.error(labels.commentEmpty);
			return;
		}

		setIsSubmitting(true);
		handleSubmitComment({ mutate, desc, postSlug })
			.then(() => {
				setDesc("");
				toast.success(labels.commentAdded);
			})
			.catch((error: unknown) => {
				if (
					typeof error === "object" &&
					error !== null &&
					"status" in error &&
					error.status === 429
				) {
					if ("waitTimeSeconds" in error && typeof error.waitTimeSeconds === "number") {
						toast.error(labels.rateLimitExceeded.replace("{time}", `${error.waitTimeSeconds}s`));
					} else {
						toast.error(labels.rateLimitExceeded.replace("{time}", "a moment"));
					}
				} else {
					toast.error(labels.commentError);
				}
			})
			.finally(() => {
				setIsSubmitting(false);
			});
	};

	return (
		<div className="comments__container">
			<h1 className="comment__title">{labels.comments}</h1>
			{status === "authenticated" && isAdmin ? (
				<div className="comment__write">
					<textarea
						placeholder={labels.writeAComment}
						className="comment__input"
						value={desc}
						onChange={handleCommentChange}
						maxLength={COMMENT_LIMITS.MAX_LENGTH}
					/>
					<div className="comment__char-counter">
						{desc.length}/{COMMENT_LIMITS.MAX_LENGTH}
					</div>
					<button className="comment__button" onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting ? labels.sending : labels.send}
					</button>
				</div>
			) : null}
			{isLoading
				? labels.loading
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
