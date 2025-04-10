"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { AdminTabs } from "./components/AdminTabs/AdminTabs";
import { PostsTab } from "./components/AdminTabs/tabs/PostsTab";
import { SuperAdminCard } from "./components/SuperAdminCard/SuperAdminCard";
import { UsersTab } from "./components/AdminTabs/tabs/users/UsersTab";
import { useClientTranslation } from "@/i18n/client-hooks";

export const AdminPageView = () => {
	const { t } = useClientTranslation();
	const { data: session } = useSession();

	const tabs = [
		{
			value: "posts",
			label: t("admin.tabs.posts", { defaultValue: "Posts" }),
			content: <PostsTab />,
		},
		{
			value: "users",
			label: t("admin.tabs.users", { defaultValue: "Users" }),
			content: <UsersTab />,
		},
	];

	const isSuperAdmin = session?.user?.role === UserRole.SUPERADMIN;

	return (
		<div className="mx-auto w-full max-w-[600px] space-y-6">
			{isSuperAdmin && <SuperAdminCard />}
			<AdminTabs tabs={tabs} defaultTab="posts" />
		</div>
	);
};
