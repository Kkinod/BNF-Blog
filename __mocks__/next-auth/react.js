const signIn = jest.fn().mockResolvedValue({ ok: true, error: null });
const signOut = jest.fn().mockResolvedValue(true);
const useSession = jest.fn().mockReturnValue({
	status: "authenticated",
	data: { user: { name: "Test User", email: "test@example.com" } },
	update: jest.fn(),
});

module.exports = {
	signIn,
	signOut,
	useSession,
};
