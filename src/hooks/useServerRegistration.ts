import { getRegistrationState } from "@/features/settings/utils/settings.service";

export async function getServerRegistrationStatus() {
	try {
		const isRegistrationEnabled = await getRegistrationState();
		return { isRegistrationEnabled };
	} catch (error) {
		// Default to true for better UX in case of errors
		if (process.env.NODE_ENV === "development") {
			console.error("Registration check failed:", error);
		}
		return { isRegistrationEnabled: true };
	}
}
