import { useState } from "react";
import Image from "next/image";
import { labels } from "@/views/labels";

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

	return (
		<div className="writePage__editor">
			<div className="writePage__addMaterialsButtonContainer">
				<button
					className="writePage__addMaterialsButton"
					onClick={() => setOpen(!open)}
					disabled={isUploading}
					aria-label={labels.writePost.addMediaAriaLabel}
				>
					<Image src="/plus.png" alt="" width={20} height={20} />
				</button>
			</div>
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
					<button className="writePage__addButton">
						<Image src="/external.png" alt="" width={20} height={20} />
					</button>
					<button className="writePage__addButton">
						<Image src="/video.png" alt="" width={20} height={20} />
					</button>
				</div>
			)}

			{isUploading && (
				<div className="writePage__uploadProgress">
					{labels.writePost.uploading}: {Math.round(uploadProgress)}%
					<button
						className="writePage__cancelUpload"
						onClick={cancelUpload}
						aria-label="Anuluj upload"
					>
						Cancel
					</button>
				</div>
			)}

			{imageUrl && (
				<div className="writePage__mediaPreview">
					<Image
						src={imageUrl}
						alt={labels.writePost.uploadedImageAlt}
						width={300}
						height={200}
						className="writePage__uploadedImage"
					/>
					<button
						className="writePage__removeMedia"
						onClick={resetUpload}
						aria-label={labels.writePost.removeImageAriaLabel}
					>
						{labels.remove}
					</button>
				</div>
			)}
		</div>
	);
};
