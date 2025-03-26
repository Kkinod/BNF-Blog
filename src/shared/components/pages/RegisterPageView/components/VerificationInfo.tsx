import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { Button } from "@/shared/components/ui/button";
import { labels } from "@/shared/utils/labels";

interface VerificationInfoProps {
	success?: string;
	onResendVerification: () => void;
	isPending: boolean;
	isResendDisabled: boolean;
}

export const VerificationInfo = ({
	success,
	onResendVerification,
	isPending,
	isResendDisabled,
}: VerificationInfoProps) => {
	return (
		<div className="space-y-6">
			<div className="flex flex-col items-center justify-center space-y-2 text-center">
				<FormSuccess message={success} />
				<p className="text-sm text-muted-foreground">{labels.verificationEmailInformation}</p>
				<div className="mt-4 flex w-full flex-col space-y-2">
					<Button
						type="button"
						variant="outline"
						onClick={onResendVerification}
						disabled={isPending || isResendDisabled}
						className="w-full"
					>
						{labels.resendVerificationEmail}
					</Button>
				</div>
			</div>
		</div>
	);
};
