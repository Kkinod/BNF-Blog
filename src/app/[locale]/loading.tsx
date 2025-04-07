"use client";

import { Loader } from "@/shared/components/organisms/Loader/Loader";

export default function Loading() {
	return (
		<div className="flex h-full flex-col items-center justify-center gap-4">
			<Loader size="large" theme="matrix" />
		</div>
	);
}
