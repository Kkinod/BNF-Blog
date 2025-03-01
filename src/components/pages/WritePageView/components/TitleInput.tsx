import { labels } from "@/views/labels";
import { Input } from "@/components/ui/input";

interface TitleInputProps {
	title: string;
	onTitleChange: (title: string) => void;
	hasError: boolean;
}

export const TitleInput = ({ title, onTitleChange, hasError }: TitleInputProps) => {
	return (
		<div className="writePage__inputContainer">
			<Input
				type="text"
				placeholder={labels.writePost.titlePlaceholder}
				aria-label={labels.writePost.titleAriaLabel}
				className={`writePage__input ${hasError ? "border-error" : ""}`}
				onChange={(e) => onTitleChange(e.target.value)}
				value={title}
			/>
			{hasError && <span className="writePage__error">{labels.errors.titleRequired}</span>}
		</div>
	);
};
