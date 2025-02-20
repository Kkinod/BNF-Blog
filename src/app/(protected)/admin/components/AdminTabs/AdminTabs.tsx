"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export type AdminTab = {
	value: string;
	label: string;
	content: React.ReactNode;
};

type AdminTabsProps = {
	tabs: AdminTab[];
	defaultTab?: string;
};

export const AdminTabs = ({ tabs, defaultTab }: AdminTabsProps) => {
	return (
		<Tabs defaultValue={defaultTab || tabs[0]?.value} className="w-full">
			<TabsList
				className="grid w-full bg-muted"
				style={{ gridTemplateColumns: `repeat(${tabs.length}, 1fr)` }}
			>
				{tabs.map((tab) => (
					<TabsTrigger key={tab.value} value={tab.value} className="data-[state=active]:bg-card">
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
			{tabs.map((tab) => (
				<TabsContent key={tab.value} value={tab.value}>
					{tab.content}
				</TabsContent>
			))}
		</Tabs>
	);
};
