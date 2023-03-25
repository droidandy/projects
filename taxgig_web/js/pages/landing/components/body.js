import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { LandingWrapper } from "../../../components/styles";
import LandingFooter from "../../../components/footers/landing";
import { MainContent } from "./styles";

function Body(props) {
	const { children, general, dispatch } = props;

	return (
		<Fragment>
			<MainContent>
				<LandingWrapper>{children}</LandingWrapper>
				<LandingFooter general={general} dispatch={dispatch} />
			</MainContent>
		</Fragment>
	);
}

Body.propTypes = {
	children: PropTypes.object
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general,
});

export default connect(mapStateToProps)(Body);
