"use client";

import Image from "next/image";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";
import { handleSubmitComment, useComments } from "@/features/blog/api/comments/request";
import { labels } from "@/shared/utils/labels";
import { COMMENT_LIMITS } from "@/config/constants";
import { formatTimeMMSS } from "@/shared/utils/timeFormat";
import { formatDate } from "@/shared/utils/formatters";
import { SimpleLoader } from "@/shared/components/organisms/SimpleLoader";
import { useClientTranslation } from "@/i18n/client-hooks";
import { useRegistration } from "@/hooks/useRegistration";
import "./comments.css";

export const Comments = ({ postSlug }: { postSlug: string }) => {
	const [desc, setDesc] = useState<string>("");
	const [isSubmitting, setIsSubmitting] = useState(false);
	const { status } = useSession();
	const { t, i18n } = useClientTranslation();
	const { isRegistrationEnabled } = useRegistration();

	const { data, isLoading, mutate } = useComments(postSlug);

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
					let formattedTime = "a moment";
					if (
						typeof error === "object" &&
						"waitTimeSeconds" in error &&
						typeof error.waitTimeSeconds === "number"
					) {
						formattedTime = formatTimeMMSS(error.waitTimeSeconds);
					}

					toast.error(labels.rateLimitExceeded.replace("{time}", formattedTime));
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
			<h4 className="comment__title">
				{t("comments.title", { defaultValue: labels.comments.title })}
			</h4>
			{status === "authenticated" ? (
				<div className="comment__write">
					<textarea
						placeholder={t("comments.writeComment", { defaultValue: labels.comments.writeComment })}
						className="comment__input"
						value={desc}
						onChange={handleCommentChange}
						maxLength={COMMENT_LIMITS.MAX_LENGTH}
					/>
					<div className="comment__char-counter">
						{desc.length}/{COMMENT_LIMITS.MAX_LENGTH}
					</div>
					<button className="comment__button" onClick={handleSubmit} disabled={isSubmitting}>
						{isSubmitting
							? t("comments.sending", { defaultValue: labels.comments.sending })
							: t("comments.submit", { defaultValue: labels.comments.submit })}
					</button>
				</div>
			) : isRegistrationEnabled ? (
				<div className="comment__login-message">
					{t("comments.loginToComment", { defaultValue: labels.comments.loginToWriteComment })}
				</div>
			) : null}
			{isLoading ? (
				<div className="comments__loading">
					<SimpleLoader size="medium" theme="default" />
				</div>
			) : data && data.length > 0 ? (
				data.map((item) => (
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
									<span className="comment__date">
										{formatDate(item.createdAt, "long", i18n.language)}
									</span>
								</div>
							</div>
							<p className="comment_description">{item.desc}</p>
						</div>
					</div>
				))
			) : null}
		</div>
	);
};
