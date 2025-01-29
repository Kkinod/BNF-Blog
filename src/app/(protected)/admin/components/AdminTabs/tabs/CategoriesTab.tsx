import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const CategoriesTab = () => {
	return (
		<Card>
			<CardHeader>
				<p className="text-center text-2xl font-semibold">Kategorie</p>
			</CardHeader>
			<CardContent>
				<p className="text-center text-muted-foreground">Sekcja w przygotowaniu</p>
			</CardContent>
		</Card>
	);
};
