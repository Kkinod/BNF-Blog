import { useState } from "react";
import Image from "next/image";
import { labels } from "@/shared/utils/labels";
import { useClientTranslation } from "@/i18n/client-hooks";

interface MediaUploaderProps {
	setFile: (file: File | null) => void;
	imageUrl: string;
	uploadProgress: number;
	isUploading: boolean;
	resetUpload: () => void;
	cancelUpload: () => void;
}

export const MediaUploader = ({
	setFile,
	imageUrl,
	uploadProgress,
	isUploading,
	resetUpload,
	cancelUpload,
}: MediaUploaderProps) => {
	const [open, setOpen] = useState<boolean>(false);
	const { t } = useClientTranslation();

	return (
		<div className="writePage__editor">
			<div className="writePage__addMaterialsButtonContainer">
				<button
					className="writePage__addMaterialsButton"
					onClick={() => setOpen(!open)}
					disabled={isUploading}
					aria-label={t("writePost.addMediaAriaLabel", {
						defaultValue: labels.writePost.addMediaAriaLabel,
					})}
				>
					<Image src="/plus.png" alt="" width={20} height={20} />
				</button>

				{open && !imageUrl && !isUploading && (
					<div className="writePage__addButtonsContainer">
						<input
							type="file"
							id="image"
							onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)}
							style={{ display: "none" }}
						/>
						<button className="writePage__addButton">
							<label htmlFor="image" className="labelek">
								<Image src="/image.png" alt="" width={20} height={20} />
							</label>
						</button>
						<button className="writePage__addButton" disabled title="Coming soon">
							<Image src="/external.png" alt="" width={20} height={20} />
						</button>
						<button className="writePage__addButton" disabled title="Coming soon">
							<Image src="/video.png" alt="" width={20} height={20} />
						</button>
					</div>
				)}
			</div>

			{isUploading && (
				<div className="writePage__uploadProgress">
					{t("writePost.uploading", { defaultValue: labels.writePost.uploading })}:{" "}
					{Math.round(uploadProgress)}%
					<button
						className="writePage__cancelUpload"
						onClick={cancelUpload}
						aria-label="Anuluj upload"
					>
						{t("writePost.cancel", { defaultValue: labels.writePost.cancel })}
					</button>
				</div>
			)}

			{imageUrl && (
				<div className="writePage__mediaPreview">
					<Image
						src={imageUrl}
						alt={t("writePost.uploadedImageAlt", {
							defaultValue: labels.writePost.uploadedImageAlt,
						})}
						width={300}
						height={200}
						className="writePage__uploadedImage"
					/>
					<button
						className="writePage__removeMedia"
						onClick={resetUpload}
						aria-label={t("writePost.removeImageAriaLabel", {
							defaultValue: labels.writePost.removeImageAriaLabel,
						})}
					>
						{t("writePost.remove", { defaultValue: labels.writePost.remove })}
					</button>
				</div>
			)}
		</div>
	);
};
