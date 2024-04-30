"use client";

import { type UserRole } from "@prisma/client";
import { useCurrentRole } from "../../../../hooks/useCurrentRole";
import { FormError } from "@/components/molecules/FormError/FormError";
import { labels } from "@/views/labels";

interface RoleGateProps {
	children: React.ReactNode;
	allowedRole: UserRole;
}

export const RoleGate = ({ children, allowedRole }: RoleGateProps) => {
	const role = useCurrentRole();

	if (role !== allowedRole) {
		return <FormError message={labels.errors.youDoNoteHavePermissionToViewThisContent}></FormError>;
	}

	return <>{children}</>;
};
