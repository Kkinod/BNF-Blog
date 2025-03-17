"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { TitleInput } from "./components/TitleInput";
import { CategorySelector } from "./components/CategorySelector";
import { MediaUploader } from "./components/MediaUploader";
import { ContentEditor } from "./components/ContentEditor";
import { PublishButton } from "./components/PublishButton";
import { type Category } from "@/app/api/categories/route";
import { getDataCategories } from "@/features/blog/api/categories/request";
import { useImageUpload } from "@/hooks/blog/useImageUpload";
import { usePostForm } from "@/hooks/blog/usePostForm";
import { useEditPostForm } from "@/hooks/blog/useEditPostForm";
import { labels } from "@/shared/utils/labels";
import { Loader } from "@/shared/components/organisms/Loader/Loader";
import "./postFormView.css";

interface PostFormViewProps {
	postId?: string;
	mode?: "create" | "edit";
}

export const PostFormView = ({ postId, mode = "create" }: PostFormViewProps) => {
	const [categories, setCategories] = useState<Category[]>([]);
	const [isLoadingCategories, setIsLoadingCategories] = useState(true);

	const { status } = useSession();

	const { setFile, imageUrl, uploadProgress, isUploading, resetUpload, cancelUpload, setImageUrl } =
		useImageUpload();

	const isEditMode = mode === "edit" && !!postId;

	const createPostForm = usePostForm(imageUrl);

	const editPostForm = useEditPostForm(
		isEditMode ? postId || "" : "",
		imageUrl,
		setImageUrl as (url: string) => void,
	);

	const formData = isEditMode ? editPostForm : createPostForm;

	const {
		title,
		content,
		categorySlug,
		errors,
		isSubmitting,
		setTitle,
		setContent,
		setCategorySlug,
		handleSubmit,
	} = formData;

	const isLoading = isEditMode ? editPostForm.isLoading : false;
	const error = isEditMode ? editPostForm.error : null;

	useEffect(() => {
		const fetchCategories = async () => {
			try {
				const categoriesData = await getDataCategories();
				setCategories(categoriesData);
			} catch (error) {
				if (process.env.NODE_ENV === "development") {
					console.error("[DEV] Error fetching categories:", error);
				}
				toast.error(labels.errors.somethingWentWrong);
			} finally {
				setIsLoadingCategories(false);
			}
		};

		void fetchCategories();
	}, []);

	if (status === "unauthenticated") {
		return <div className="unauthorized">{labels.writePost.unauthorized}</div>;
	}

	if (isEditMode && error) {
		return <div className="error">{error}</div>;
	}

	const pageTitle = isEditMode ? labels.writePost.editPageTitle : labels.writePost.pageTitle;

	const buttonLabel = isEditMode ? labels.writePost.updatePost : undefined;

	return (
		<div className="writePage__container">
			<div className="writePage__card">
				{(isSubmitting || status === "loading" || (isEditMode && isLoading)) && (
					<div className="writePage__submitting-overlay">
						<div>
							<Loader theme="matrix" size="large" />
						</div>
					</div>
				)}

				<div className="writePage__header">
					<h1 className="writePage__title">{pageTitle}</h1>
				</div>

				<div className="writePage__content">
					<div className="writePage__section">
						<TitleInput title={title} onTitleChange={setTitle} hasError={errors.title} />
						<CategorySelector
							categories={categories}
							isLoading={isLoadingCategories}
							selectedCategory={categorySlug}
							onSelectCategory={setCategorySlug}
							hasError={errors.category}
						/>
					</div>

					<div className="writePage__section">
						<div className="writePage__editorContainer">
							<MediaUploader
								setFile={setFile}
								imageUrl={imageUrl}
								uploadProgress={uploadProgress}
								isUploading={isUploading}
								resetUpload={resetUpload}
								cancelUpload={cancelUpload}
							/>
							<ContentEditor
								content={content}
								onContentChange={setContent}
								hasError={errors.content}
							/>
						</div>
					</div>
				</div>

				<div className="writePage__footer">
					<PublishButton
						onPublish={handleSubmit}
						disabled={isUploading || isSubmitting}
						label={buttonLabel}
					/>
				</div>
			</div>
		</div>
	);
};
