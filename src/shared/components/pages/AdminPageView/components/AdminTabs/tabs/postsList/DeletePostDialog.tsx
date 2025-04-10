import { useState } from "react";
import { type ListPost } from "@/app/api/posts/route";
import { labels } from "@/shared/utils/labels";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/shared/components/ui/alert-dialog";
import { Button } from "@/shared/components/ui/button";
import { useClientTranslation } from "@/i18n/client-hooks";

interface DeletePostDialogProps {
	post: ListPost;
	onDeletePost: (post: ListPost) => Promise<void>;
	isDisabled: boolean;
}

export const DeletePostDialog = ({ post, onDeletePost, isDisabled }: DeletePostDialogProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const { t } = useClientTranslation();

	const handleDelete = async () => {
		await onDeletePost(post);
		setIsOpen(false);
	};

	return (
		<AlertDialog open={isOpen} onOpenChange={setIsOpen}>
			<Button
				variant="destructive"
				size="sm"
				onClick={() => setIsOpen(true)}
				disabled={isDisabled}
				className="s:w-full s:max-w-[100px]"
			>
				{t("admin.posts.delete", { defaultValue: labels.posts.delete })}
			</Button>
			<AlertDialogContent className="rounded-xl border border-zinc-800 bg-[#0f172a] text-white">
				<AlertDialogHeader className="border-b border-zinc-800 pb-4">
					<AlertDialogTitle className="text-xl">
						{t("admin.posts.deleteConfirmTitle", { defaultValue: labels.posts.deleteConfirmTitle })}
					</AlertDialogTitle>
					<AlertDialogDescription className="text-zinc-400">
						{t("admin.posts.deleteConfirmDescription", {
							defaultValue: labels.posts.deleteConfirmDescription,
						})}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<div className="my-4 rounded-md bg-zinc-800 p-4">
					<h4 className="font-medium text-white">{post.title}</h4>
					<p className="text-sm text-zinc-400">{new Date(post.createdAt).toLocaleDateString()}</p>
				</div>
				<AlertDialogFooter>
					<AlertDialogCancel className="border-zinc-700 bg-transparent text-white hover:bg-zinc-800">
						{t("admin.posts.deleteConfirmCancel", {
							defaultValue: labels.posts.deleteConfirmCancel,
						})}
					</AlertDialogCancel>
					<AlertDialogAction
						onClick={handleDelete}
						className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
					>
						{t("admin.posts.deleteConfirmAction", {
							defaultValue: labels.posts.deleteConfirmAction,
						})}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
};
