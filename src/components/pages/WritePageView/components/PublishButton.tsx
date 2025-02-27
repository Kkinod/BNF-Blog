import { labels } from "@/views/labels";

interface PublishButtonProps {
	onPublish: () => void;
}

export const PublishButton = ({ onPublish }: PublishButtonProps) => {
	return (
		<div className="writePage__publishContainer">
			<button
				className="writePage__publish"
				onClick={onPublish}
				aria-label={labels.writePost.publishAriaLabel}
			>
				{labels.publish}
			</button>
		</div>
	);
};
