import { labels } from "@/shared/utils/labels";
import { Button } from "@/shared/components/ui/button";
import { useClientTranslation } from "@/i18n/client-hooks";

interface PublishButtonProps {
	onPublish: () => void;
	disabled?: boolean;
	label?: string;
}

export const PublishButton = ({ onPublish, disabled = false, label }: PublishButtonProps) => {
	const { t } = useClientTranslation();

	const buttonLabel = label || t("writePost.publish", { defaultValue: labels.writePost.publish });

	return (
		<div className="writePage__publishContainer">
			<Button
				onClick={onPublish}
				aria-label={t("writePost.publishAriaLabel", {
					defaultValue: labels.writePost.publishAriaLabel,
				})}
				className="writePage__publish"
				disabled={disabled}
			>
				{buttonLabel}
			</Button>
		</div>
	);
};
