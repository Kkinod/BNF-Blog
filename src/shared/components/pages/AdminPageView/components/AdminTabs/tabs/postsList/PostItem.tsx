import Link from "next/link";
import { DeletePostDialog } from "./DeletePostDialog";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";
import { type ListPost } from "@/app/api/posts/route";
import { useClientTranslation } from "@/i18n/client-hooks";

interface PostItemProps {
	post: ListPost;
	onToggleVisibility: (post: ListPost) => Promise<void>;
	onTogglePick: (post: ListPost) => Promise<void>;
	onDeletePost: (post: ListPost) => Promise<void>;
	isDisabled: boolean;
	remainingPicks: number;
}

export const PostItem = ({
	post,
	onToggleVisibility,
	onTogglePick,
	onDeletePost,
	isDisabled,
	remainingPicks,
}: PostItemProps) => {
	const { t } = useClientTranslation();

	return (
		<div className="py-4">
			<div className="flex flex-row items-center justify-between s:flex-col s:items-start s:gap-4">
				<div>
					<h3 className="text-lg font-medium">{post.title}</h3>
					<p className="text-sm text-muted-foreground">
						{new Date(post.createdAt).toLocaleDateString()}
					</p>
					<p className="text-sm text-muted-foreground">
						{t("admin.posts.category", { defaultValue: labels.posts.category })}:{" "}
						{t(`categories.${post.catSlug}`, { defaultValue: post.catSlug })}
					</p>
					<p className="text-sm text-muted-foreground">
						{t("admin.posts.views", { defaultValue: labels.posts.views })}: {post.views}
					</p>
				</div>
				<div className="flex gap-2 sm:grid sm:w-full sm:max-w-[210px] sm:grid-cols-2">
					<Link href={`/admin/edit-post/${post.slug}`} className="sm:w-full">
						<Button
							variant="default"
							size="sm"
							disabled={isDisabled}
							className="sm:w-full sm:max-w-[100px]"
						>
							{t("admin.posts.edit", { defaultValue: labels.posts.edit })}
						</Button>
					</Link>
					<Button
						variant={post.isVisible ? "outline" : "secondary"}
						size="sm"
						onClick={() => onToggleVisibility(post)}
						disabled={isDisabled}
						className="sm:w-full sm:max-w-[100px]"
					>
						{post.isVisible
							? t("admin.posts.hide", { defaultValue: labels.posts.hide })
							: t("admin.posts.show", { defaultValue: labels.posts.show })}
					</Button>
					<Button
						variant={post.isPick ? "secondary" : "default"}
						size="sm"
						onClick={() => onTogglePick(post)}
						disabled={isDisabled || (!post.isPick && remainingPicks === 0)}
						className="sm:w-full sm:max-w-[100px]"
					>
						{post.isPick
							? t("admin.posts.unpick", { defaultValue: labels.posts.unpick })
							: `${t("admin.posts.pick", { defaultValue: labels.posts.pick })} (${remainingPicks})`}
					</Button>
					<DeletePostDialog post={post} onDeletePost={onDeletePost} isDisabled={isDisabled} />
				</div>
			</div>
		</div>
	);
};
