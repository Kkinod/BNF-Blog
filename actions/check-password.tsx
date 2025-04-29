"use server";

import crypto from "crypto";

export async function checkPasswordInHibp(password: string): Promise<{
	isCompromised: boolean;
	error?: string;
}> {
	try {
		const sha1Hash = crypto.createHash("sha1").update(password).digest("hex").toUpperCase();
		const prefix = sha1Hash.substring(0, 5);
		const suffix = sha1Hash.substring(5);

		const response = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
			headers: {
				"User-Agent": "BlogBNF",
				"Add-Padding": "true",
			},
			cache: "no-store",
		});

		if (!response.ok) {
			console.error("Error checking HiBP API:", response.status);
			return { isCompromised: false };
		}

		const responseText = await response.text();

		if (!responseText) {
			console.error("Empty response from HiBP API");
			return { isCompromised: false };
		}

		const hashes = responseText.split("\n");

		for (const hash of hashes) {
			const [hashSuffix] = hash.split(":");
			if (hashSuffix.trim().toUpperCase() === suffix) {
				return { isCompromised: true };
			}
		}

		return { isCompromised: false };
	} catch (error) {
		console.error("Error checking password in HiBP:", error);
		return { isCompromised: false, error: "Failed to check password security" };
	}
}
