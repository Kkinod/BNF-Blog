import { useState, useEffect, useCallback } from "react";

interface RegistrationResponse {
	isRegistrationEnabled: boolean;
	success?: string;
	error?: string;
}

export function useRegistration() {
	const [isRegistrationEnabled, setIsRegistrationEnabled] = useState<boolean>(false);
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [error, setError] = useState<Error | null>(null);

	const fetchRegistrationState = useCallback(async () => {
		try {
			setIsLoading(true);
			const response = await fetch("/api/admin/registration");
			const data = (await response.json()) as RegistrationResponse;

			setIsRegistrationEnabled(data.isRegistrationEnabled);
			setError(null);
		} catch (error) {
			if (process.env.NODE_ENV === "development") {
				console.error("Registration check failed:", error);
			}
			// Default to true in case of error for better UX
			setIsRegistrationEnabled(true);
			setError(error instanceof Error ? error : new Error("Failed to check registration status"));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		void fetchRegistrationState();
	}, [fetchRegistrationState]);

	const toggleRegistration = async (): Promise<{ success?: string; error?: string }> => {
		if (isRegistrationEnabled === null) {
			return { error: "Registration state not loaded yet" };
		}

		try {
			setIsLoading(true);
			const newState = !isRegistrationEnabled;

			const response = await fetch("/api/admin/registration", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ isEnabled: newState }),
			});

			const data = (await response.json()) as RegistrationResponse;

			if (data.error) {
				setError(new Error(data.error));
				return { error: data.error };
			}

			setIsRegistrationEnabled(newState);
			setError(null);

			return { success: data.success };
		} catch (error) {
			const errorMessage = error instanceof Error ? error.message : "Failed to toggle registration";
			if (process.env.NODE_ENV === "development") {
				console.error("Failed to toggle registration:", error);
			}
			setError(error instanceof Error ? error : new Error(errorMessage));
			return { error: errorMessage };
		} finally {
			setIsLoading(false);
		}
	};

	return {
		isRegistrationEnabled,
		isLoading,
		error,
		toggleRegistration,
		refetch: fetchRegistrationState,
	};
}
