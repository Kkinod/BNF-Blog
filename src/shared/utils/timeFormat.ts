/**
 * Format seconds to MM:SS format
 * @param seconds Total seconds
 * @returns Formatted time string in MM:SS format
 */
export const formatTimeMMSS = (seconds: number): string => {
	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = seconds % 60;
	return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`;
};
