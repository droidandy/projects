import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


function CreateAccountView(props) {
	const { general, dispatch } = props;

	return <h1>This is create account view (Step 1)</h1>;
}

CreateAccountView.propTypes = {
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general,
});

export default connect(mapStateToProps)(CreateAccountView);

