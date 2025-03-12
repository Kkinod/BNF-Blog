import { useState, useTransition } from "react";
import { toast } from "sonner";
import { resendVerificationEmail } from "../../../actions/resend-verification";
import { labels } from "../../shared/utils/labels";
import { useTimeCounter } from "./useTimeCounter";

export const useEmailVerification = () => {
	const [verificationEmail, setVerificationEmail] = useState<string>("");
	const [showVerification, setShowVerification] = useState<boolean>(false);
	const [isPending, startTransition] = useTransition();
	const [isResendDisabled, setIsResendDisabled] = useState<boolean>(false);

	const {
		timeRemaining: resendTimeRemaining,
		formatTime,
		start: startResendTimer,
	} = useTimeCounter(0, () => setIsResendDisabled(false));

	const handleResendVerification = () => {
		if (!verificationEmail) return;

		setIsResendDisabled(true);
		startResendTimer(120);

		startTransition(async () => {
			try {
				const data = await resendVerificationEmail(verificationEmail);

				if (data?.error) {
					toast.error(data.error);
					setIsResendDisabled(false);
					startResendTimer(0);
				} else if (data?.success) {
					toast.success(data.success);
				}
			} catch (error) {
				toast.error(labels.errors.somethingWentWrong);
				console.error("Resend Verification Error:", error);
				setIsResendDisabled(false);
				startResendTimer(0);
			}
		});
	};

	const startVerification = (email: string, waitTimeSeconds?: number) => {
		setVerificationEmail(email);
		setShowVerification(true);

		if (waitTimeSeconds && waitTimeSeconds > 0) {
			setIsResendDisabled(true);
			startResendTimer(waitTimeSeconds);

			const formattedTime = formatTime(waitTimeSeconds);
			toast.info(
				labels.errors.resendVerificationRateLimitExceeded.replace("{time}", formattedTime),
			);
		}
	};

	return {
		verificationEmail,
		showVerification,
		isResendDisabled,
		resendTimeRemaining,
		isPending,
		formatTime,
		handleResendVerification,
		startVerification,
		setShowVerification,
		setVerificationEmail,
	};
};
