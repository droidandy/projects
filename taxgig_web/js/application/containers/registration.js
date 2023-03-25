import React from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";

// Styles
import {
	size,
	RegistrationMainContainer,
	RegistrationBody
} from "../../components/styles";

// Pages
import AccountSelectView from "../../pages/registration/views/account_select_view";
import CreateAccountView from "../../pages/registration/views/create_account_view";

function RegistrationContainer(props) {
	const renderRoutes = () => {
		return (
			<Switch>
				<Route
					exact
					path="/registration"
					component={AccountSelectView}
				/>
				<Route
					exact
					path="/registration/create_account"
					component={CreateAccountView}
				/>

				<Redirect from="*" to="/not_found" />
			</Switch>
		);
	};

	return (
		<RegistrationMainContainer>
			<h1>Registration header</h1>
			{renderRoutes()}
			<h1>Registration footer</h1>
		</RegistrationMainContainer>
	);
}

RegistrationContainer.propTypes = {
	router: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	router: state.router
});

export default connect(mapStateToProps)(RegistrationContainer);
