"use client";

import { type UserRole } from "@prisma/client";
import { useCurrentRole } from "../../../../hooks/auth/useCurrentRole";
import { FormError } from "@/shared/components/molecules/FormError/FormError";
import { labels } from "@/shared/utils/labels";

interface RoleGateProps {
	children: React.ReactNode;
	allowedRoles: UserRole[];
}

export const RoleGate = ({ children, allowedRoles }: RoleGateProps) => {
	const role = useCurrentRole();

	if (!role || !allowedRoles.includes(role)) {
		return <FormError message={labels.errors.youDoNoteHavePermissionToViewThisContent}></FormError>;
	}

	return <>{children}</>;
};
