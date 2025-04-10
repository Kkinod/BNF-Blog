import { labels } from "@/shared/utils/labels";
import { Input } from "@/shared/components/ui/input";
import { useClientTranslation } from "@/i18n/client-hooks";

interface TitleInputProps {
	title: string;
	onTitleChange: (title: string) => void;
	hasError: boolean;
}

export const TitleInput = ({ title, onTitleChange, hasError }: TitleInputProps) => {
	const { t } = useClientTranslation();

	return (
		<div className="writePage__inputContainer">
			<Input
				type="text"
				placeholder={t("writePost.titlePlaceholder", {
					defaultValue: labels.writePost.titlePlaceholder,
				})}
				aria-label={t("writePost.titleAriaLabel", {
					defaultValue: labels.writePost.titleAriaLabel,
				})}
				className={`writePage__input ${hasError ? "border-error" : ""}`}
				onChange={(e) => onTitleChange(e.target.value)}
				value={title}
			/>
			{hasError && (
				<span className="writePage__error">
					{t("errors.titleRequired", { defaultValue: labels.errors.titleRequired })}
				</span>
			)}
		</div>
	);
};
