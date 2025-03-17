import { labels } from "@/shared/utils/labels";
import { Button } from "@/shared/components/ui/button";

interface PublishButtonProps {
	onPublish: () => void;
	disabled?: boolean;
	label?: string;
}

export const PublishButton = ({
	onPublish,
	disabled = false,
	label = labels.publish,
}: PublishButtonProps) => {
	return (
		<div className="writePage__publishContainer">
			<Button
				onClick={onPublish}
				aria-label={labels.writePost.publishAriaLabel}
				className="writePage__publish"
				disabled={disabled}
			>
				{label}
			</Button>
		</div>
	);
};
