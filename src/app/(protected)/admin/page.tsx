"use client";

import { AdminTabs } from "./components/AdminTabs/AdminTabs";
import { PostsTab } from "./components/AdminTabs/tabs/PostsTab";
import { AdminCard } from "./components/AdminCard/AdminCard";
import { UsersTab } from "./components/AdminTabs/tabs/users/UsersTab";

const AdminPage = () => {
	const tabs = [
		{
			value: "posts",
			label: "Posty",
			content: <PostsTab />,
		},
		{
			value: "users",
			label: "Użytkownicy",
			content: <UsersTab />,
		},
	];

	return (
		<div className="mx-auto w-full max-w-[600px] space-y-6">
			<AdminCard />
			<AdminTabs tabs={tabs} defaultTab="posts" />
		</div>
	);
};

export default AdminPage;
