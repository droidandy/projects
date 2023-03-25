import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import PrimaryContainer from "../containers/primary";
import LandingContainer from "../containers/landing";
import RegistrationContainer from "../containers/registration";

// V2: add PlatformContainer
export default function configRoutes(store) {
	return (
		<PrimaryContainer>
			<Switch>
				<Route path="/registration" component={RegistrationContainer} />
				<Route path="/" component={LandingContainer} />

				<Redirect from="*" to="/" />
			</Switch>
		</PrimaryContainer>
	);
}
