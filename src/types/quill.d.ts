declare module "quill" {
	interface QuillStatic {
		register: (name: string, module: unknown) => void;
		import: (name: string) => unknown;
	}

	const Quill: QuillStatic;
	// eslint-disable-next-line import/no-default-export
	export default Quill;
}
