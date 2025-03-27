export const formatDate = (
	dateString: string | Date,
	format: "short" | "long" = "short",
): string => {
	const date = typeof dateString === "string" ? new Date(dateString) : dateString;

	if (format === "long") {
		const options: Intl.DateTimeFormatOptions = {
			year: "numeric",
			month: "short",
			day: "numeric",
		};

		return date.toLocaleDateString("en-US", options);
	}

	return date.toLocaleDateString();
};
