import { useState, useTransition } from "react";
import { toast } from "sonner";
import { login } from "../../../actions/login";
import { labels } from "../../shared/utils/labels";
import { useTimeCounter } from "./useTimeCounter";

/**
 * Custom hook for managing two-factor authentication
 * @returns Object with 2FA state and control methods
 */
export const useTwoFactorAuth = () => {
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [expiresAt, setExpiresAt] = useState<number | null>(null);
	const [isPending, startTransition] = useTransition();

	const { timeRemaining, isExpired, formatTime } = useTimeCounter(
		expiresAt ? Math.max(0, Math.floor((expiresAt - Date.now()) / 1000)) : undefined,
	);

	/**
	 * Handle resending 2FA code
	 * @param email - User email
	 * @param password - User password
	 */
	const handleResendCode = (email?: string, password?: string) => {
		// Don't resend if not expired
		if (!isExpired) {
			return;
		}

		if (!email || !password) {
			toast.error(labels.errors.emailIsRequired);
			return;
		}

		startTransition(async () => {
			try {
				const data = await login({ email, password, code: "" });

				if (data?.error) {
					toast.error(data.error);
				} else if (data?.twoFactor) {
					setExpiresAt(data.expiresAt);
					toast.success(labels.twoFactorCodeResent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Resend Code Error:", error);
			}
		});
	};

	/**
	 * Start the two-factor authentication process
	 * @param newExpiresAt - Expiration timestamp for the 2FA code
	 */
	const startTwoFactorAuth = (newExpiresAt: number) => {
		setShowTwoFactor(true);
		setExpiresAt(newExpiresAt);
	};

	return {
		showTwoFactor,
		expiresAt,
		timeRemaining,
		isExpired,
		formatTime,
		isPending,
		handleResendCode,
		startTwoFactorAuth,
		setShowTwoFactor,
	};
};
