import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

interface VerificationViewProps {
	handleResendVerification: () => void;
	isPending: boolean;
	isResendDisabled: boolean;
	resendTimeRemaining: number;
	formatTime: (seconds: number) => string;
}

export const VerificationView = ({
	handleResendVerification,
	isPending,
	isResendDisabled,
	resendTimeRemaining,
	formatTime,
}: VerificationViewProps) => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center justify-center space-y-2 text-center">
				<p className="text-sm text-muted-foreground">{labels.verificationEmailInformation}</p>
				<div className="mt-4 flex w-full flex-col space-y-2">
					<Button
						type="button"
						variant="outline"
						onClick={handleResendVerification}
						disabled={isPending || isResendDisabled}
						className="w-full"
					>
						{isResendDisabled
							? `${labels.resendVerificationEmail} (${formatTime(resendTimeRemaining)})`
							: labels.resendVerificationEmail}
					</Button>
				</div>
			</div>
		</div>
	);
};
