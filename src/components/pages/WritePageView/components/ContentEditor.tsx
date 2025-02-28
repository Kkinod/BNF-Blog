import dynamic from "next/dynamic";
import { labels } from "@/views/labels";
import "react-quill/dist/quill.bubble.css";

const ReactQuill = dynamic(() => import("react-quill"), { ssr: false });

interface ContentEditorProps {
	content: string;
	onContentChange: (content: string) => void;
	hasError: boolean;
}

export const ContentEditor = ({ content, onContentChange, hasError }: ContentEditorProps) => {
	return (
		<div className="writePage__contentWrapper">
			<ReactQuill
				theme="bubble"
				value={content}
				onChange={onContentChange}
				placeholder={labels.writePost.contentPlaceholder}
				aria-label={labels.writePost.contentAriaLabel}
				className={`writePage__textArea ${hasError ? "writePage__textArea--error" : ""}`}
			/>
			{hasError && <span className="writePage__error">{labels.errors.contentRequired}</span>}
		</div>
	);
};
