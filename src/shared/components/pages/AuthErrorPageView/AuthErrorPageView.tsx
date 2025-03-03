import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { CardWrapper } from "@/shared/components/organisms/CardWrapper/CardWrapper";
import { labels } from "@/shared/utils/labels";

export const AuthErrorPageView = () => {
	return (
		<div className="flex justify-center">
			<CardWrapper
				headerLabel={labels.errors.somethingWentWrong}
				backButtonLabel={labels.backToLogin}
				backButtonHref="/auth/login"
				headerTitle={labels.errors.error}
			>
				<div className="flex w-full items-center justify-center ">
					<ExclamationTriangleIcon className="text-destructive" />
				</div>
			</CardWrapper>
		</div>
	);
};
