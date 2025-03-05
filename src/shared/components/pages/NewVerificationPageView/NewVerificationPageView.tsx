"use client";

import { useCallback, useEffect, useState } from "react";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { newVerification } from "../../../../../actions/new-verification";
import { CardWrapper } from "@/shared/components/organisms/CardWrapper/CardWrapper";
import { FormError } from "@/shared/components/molecules/FormError/FormError";
import { FormSuccess } from "@/shared/components/molecules/FormSuccess/FormSuccess";
import { labels } from "@/shared/utils/labels";

export const NewVerificationPageView = () => {
	const [error, setError] = useState<string | undefined>();
	const [success, setSuccess] = useState<string | undefined>();

	const searchParams = useSearchParams();

	const token = searchParams.get("token");

	const onSubmit = useCallback(() => {
		if (success || error) return;

		if (!token) {
			setError(labels.errors.missingToken);
			return;
		}

		newVerification(token)
			.then((data) => {
				setSuccess(data.success);
				setError(data.error);
			})
			.catch(() => {
				setError(labels.errors.somethingWentWrong);
			});
	}, [error, success, token]);

	useEffect(() => {
		onSubmit();
	}, [onSubmit]);

	return (
		<CardWrapper
			headerLabel={labels.errors.confirmYourVerification}
			backButtonLabel={labels.backToLogin}
			backButtonHref={"/login"}
			headerTitle={labels.verification}
		>
			<div className="flex w-full items-center justify-center">
				{!success && !error && (
					<span data-testid="loading-spinner">
						<BeatLoader />
					</span>
				)}
				<FormSuccess message={success} />
				{!success && <FormError message={error} />}
			</div>
		</CardWrapper>
	);
};
