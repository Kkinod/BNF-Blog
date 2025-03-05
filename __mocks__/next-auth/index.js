class AuthError extends Error {
	constructor(message) {
		super(message);
		this.name = "AuthError";
	}
}

const signIn = jest.fn().mockResolvedValue({ ok: true, error: null });
const signOut = jest.fn().mockResolvedValue(true);
const auth = jest.fn().mockResolvedValue({ user: null });

const GET = jest.fn().mockImplementation((req, res) => {
	return { status: 200, json: { message: "GET handler mock" } };
});

const POST = jest.fn().mockImplementation((req, res) => {
	return { status: 200, json: { message: "POST handler mock" } };
});

const NextAuth = jest.fn().mockImplementation((options) => {
	return {
		auth,
		signIn,
		signOut,
		update: jest.fn(),
		providers: options?.providers || [],
		callbacks: options?.callbacks || {},
		pages: options?.pages || {},
		handlers: { GET, POST },
	};
});

module.exports = NextAuth;

module.exports.AuthError = AuthError;
module.exports.signIn = signIn;
module.exports.signOut = signOut;
module.exports.auth = auth;
module.exports.handlers = { GET, POST };
