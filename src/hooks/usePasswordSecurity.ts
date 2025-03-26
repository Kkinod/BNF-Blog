import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { type UseFormReturn, type Path } from "react-hook-form";

import { checkPasswordInHibp } from "../../actions/check-password";
import { labels } from "@/shared/utils/labels";

export enum PasswordStrength {
	UNKNOWN = "unknown",
	CHECKING = "checking",
	COMPROMISED = "compromised",
	SECURE = "secure",
}

interface UsePasswordSecurityProps<T extends Record<string, unknown>> {
	debouncedPassword: string;
	form: UseFormReturn<T>;
	fieldName?: Path<T>;
}

export function usePasswordSecurity<T extends Record<string, unknown>>({
	debouncedPassword,
	form,
	fieldName = "password" as Path<T>,
}: UsePasswordSecurityProps<T>) {
	const [passwordState, setPasswordState] = useState<PasswordStrength>(PasswordStrength.UNKNOWN);
	const lastRequestId = useRef(0);

	// Check password only after successful schema validation
	useEffect(() => {
		const runValidation = async () => {
			if (!debouncedPassword || debouncedPassword.length === 0) {
				setPasswordState(PasswordStrength.UNKNOWN);
				return;
			}

			const isValid = await form.trigger(fieldName);
			if (!isValid) {
				setPasswordState(PasswordStrength.UNKNOWN);
				return;
			}

			const currentRequestId = ++lastRequestId.current;
			setPasswordState(PasswordStrength.CHECKING);

			try {
				const result = await checkPasswordInHibp(debouncedPassword);

				// Ignore results from outdated requests
				if (currentRequestId !== lastRequestId.current) return;

				if (result.isCompromised) {
					setPasswordState(PasswordStrength.COMPROMISED);
					toast.error(labels.passwordSecurityWeak);
				} else {
					setPasswordState(PasswordStrength.SECURE);
					toast.success(labels.passwordSecurityStrong);
				}
			} catch (err) {
				// Ignore errors from outdated requests
				if (currentRequestId !== lastRequestId.current) return;
				console.error("Error checking password:", err);
				setPasswordState(PasswordStrength.UNKNOWN);
			}
		};

		// eslint-disable-next-line @typescript-eslint/no-floating-promises
		runValidation();
	}, [debouncedPassword, form, fieldName]);

	// Render animated message when checking password
	const renderPasswordMessage = () => {
		if (passwordState === PasswordStrength.CHECKING) {
			return {
				text: labels.passwordSecurityChecking,
				className: "mt-1 text-xs text-yellow-500",
			};
		}
		return null;
	};

	// Determine if the submit button should be disabled due to password state
	const isSecurityCheckPassed = passwordState === PasswordStrength.SECURE;
	const isCheckingPassword = passwordState === PasswordStrength.CHECKING;
	const isPasswordCompromised = passwordState === PasswordStrength.COMPROMISED;

	return {
		passwordState,
		renderPasswordMessage,
		isSecurityCheckPassed,
		isCheckingPassword,
		isPasswordCompromised,
	};
}
