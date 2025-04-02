"use client";

import { useSession } from "next-auth/react";
import { UserRole } from "@prisma/client";
import { AdminTabs } from "./components/AdminTabs/AdminTabs";
import { PostsTab } from "./components/AdminTabs/tabs/PostsTab";
import { SuperAdminCard } from "./components/SuperAdminCard/SuperAdminCard";
import { UsersTab } from "./components/AdminTabs/tabs/users/UsersTab";

export const AdminPageView = () => {
	const tabs = [
		{
			value: "posts",
			label: "Posts",
			content: <PostsTab />,
		},
		{
			value: "users",
			label: "Users",
			content: <UsersTab />,
		},
	];

	const { data: session } = useSession();

	const isSuperAdmin = session?.user?.role === UserRole.SUPERADMIN;

	return (
		<div className="mx-auto w-full max-w-[600px] space-y-6">
			{isSuperAdmin && <SuperAdminCard />}
			<AdminTabs tabs={tabs} defaultTab="posts" />
		</div>
	);
};
