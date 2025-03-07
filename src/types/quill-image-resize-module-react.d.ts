declare module "quill-image-resize-module-react" {
	interface ImageResizeOptions {
		modules?: string[];
		displaySize?: boolean;
		handleStyles?: {
			backgroundColor?: string;
			border?: string;
			color?: string;
		};
		toolbarStyles?: {
			backgroundColor?: string;
			border?: string;
			color?: string;
		};
		parchment?: unknown;
	}

	const ImageResize: {
		default: ImageResizeOptions;
	};

	// eslint-disable-next-line import/no-default-export
	export default ImageResize;
}
