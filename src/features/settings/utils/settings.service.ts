import { prisma } from "@/shared/utils/connect";
import { SETTINGS_KEYS } from "@/config/constants";

export async function isRegistrationEnabled(): Promise<boolean> {
	try {
		const setting = await prisma.setting.findUnique({
			where: { key: SETTINGS_KEYS.REGISTRATION_ENABLED },
		});

		if (!setting) {
			return true;
		}

		return setting.value === "true";
	} catch (error) {
		console.error("Error checking registration status:", error);
		return true;
	}
}

export async function saveRegistrationState(isEnabled: boolean): Promise<void> {
	try {
		await prisma.setting.upsert({
			where: { key: SETTINGS_KEYS.REGISTRATION_ENABLED },
			update: { value: isEnabled.toString() },
			create: {
				key: SETTINGS_KEYS.REGISTRATION_ENABLED,
				value: isEnabled.toString(),
			},
		});
	} catch (error) {
		console.error("Error saving registration state:", error);
		throw error;
	}
}

export async function getRegistrationState(): Promise<boolean> {
	return isRegistrationEnabled();
}
