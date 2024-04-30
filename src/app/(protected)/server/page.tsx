import { UserInfo } from "@/components/pages/UserInfo/UserInfo";
import { currentUser } from "@/lib/currentUser";

const ServerPage = async () => {
	const user = await currentUser();

	return <UserInfo user={user} label="Server component" />;
};

export default ServerPage;
