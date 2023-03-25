import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";


function AccountSelectView(props) {
	const { general, dispatch } = props;

	return <h1>This is account select view (Step 0)</h1>;
}

AccountSelectView.propTypes = {
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general,
});

export default connect(mapStateToProps)(AccountSelectView);

