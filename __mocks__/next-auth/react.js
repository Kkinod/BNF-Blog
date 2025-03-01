// Mock for next-auth/react
const useSession = jest.fn().mockReturnValue({
	status: "authenticated",
	data: { user: { name: "Test User" } },
});

module.exports = {
	useSession,
};
