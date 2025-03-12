import { useState, useTransition } from "react";
import { toast } from "sonner";
import { login } from "../../../actions/login";
import { labels } from "../../shared/utils/labels";
import { useTimeCounter } from "./useTimeCounter";

export const useTwoFactorAuth = () => {
	const [showTwoFactor, setShowTwoFactor] = useState<boolean>(false);
	const [expiresAt, setExpiresAt] = useState<number | null>(null);
	const [isPending, startTransition] = useTransition();

	const { timeRemaining, isExpired, formatTime, start: startTimer } = useTimeCounter();

	const handleResendCode = (email: string, password: string) => {
		if (!isExpired) return;

		if (!email || !password) {
			toast.error(labels.errors.emailIsRequired);
			return;
		}

		startTransition(async () => {
			try {
				const data = await login({ email, password });

				if (data?.error) {
					toast.error(data.error);
				} else if (data?.twoFactor) {
					setExpiresAt(data.expiresAt);
					const now = Date.now();
					const remaining = Math.max(0, Math.floor((data.expiresAt - now) / 1000));
					startTimer(remaining);
					toast.success(labels.twoFactorCodeResent);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Resend Code Error:", error);
			}
		});
	};

	const startTwoFactorAuth = (expiresAtValue: number) => {
		setShowTwoFactor(true);
		setExpiresAt(expiresAtValue);
		const now = Date.now();
		const remaining = Math.max(0, Math.floor((expiresAtValue - now) / 1000));
		startTimer(remaining);
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
