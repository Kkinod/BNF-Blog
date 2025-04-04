import { UserInfo } from "@/shared/components/pages/UserInfo/UserInfo";
import { currentUser } from "@/features/auth/utils/currentUser";

const ProfilPage = async () => {
	const user = await currentUser();

	return <UserInfo user={user} />;
};

export default ProfilPage;
