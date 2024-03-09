import "./loginPage.css";

const LoginPage = () => {
	return (
		<div className="loginPage__container">
			<div className="loginPage__wrapper">
				<div className="loginPage__socialButton">Sign in with Google</div>
				<div className="loginPage__socialButton">Sign in with Github</div>
				<div className="loginPage__socialButton">Sign in with Facebook</div>
			</div>
		</div>
	);
};

export default LoginPage;
