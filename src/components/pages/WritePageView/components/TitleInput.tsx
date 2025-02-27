import { labels } from "@/views/labels";

interface TitleInputProps {
	title: string;
	onTitleChange: (title: string) => void;
	hasError: boolean;
}

export const TitleInput = ({ title, onTitleChange, hasError }: TitleInputProps) => {
	return (
		<div className="writePage__inputContainer">
			<input
				type="text"
				placeholder={labels.writePost.titlePlaceholder}
				aria-label={labels.writePost.titleAriaLabel}
				className={`writePage__input ${hasError ? "writePage__input--error" : ""}`}
				onChange={(e) => onTitleChange(e.target.value)}
				value={title}
			/>
			{hasError && <span className="writePage__error">{labels.errors.titleRequired}</span>}
		</div>
	);
};
