import React, { Fragment, useState, useLayoutEffect, useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

// Components
import Cookies from "../../components/cookies";
import Notification from "../../components/notification";

import Actions from "../actions";

const storageName = 'cookiesAccepted';

function PrimaryContainer(props) {
	const { dispatch, general, children } = props;
	const {
		showNotification,
		notificationText,
		notificationType,
		acceptCookies,
		isPro
	} = general;

	// HANDLES DEVICE WIDTH CHANGES
	// https://kentcdodds.com/blog/useeffect-vs-uselayouteffect
	useLayoutEffect(() => {
		function updateSize() {
			dispatch(Actions.setDevice(window.innerWidth));
		}

		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	useEffect(() => {
		const data = JSON.parse(localStorage.getItem(storageName));

		if (!data || typeof data.accepted !== "boolean") {
			dispatch(Actions.rejectCookies());
			return;
		}

		if(data.accepted) {
			dispatch(Actions.acceptCookies());
		}
		else {
			dispatch(Actions.rejectCookies());
		}
	}, []);

	function handleAcceptCookies() {
		localStorage.setItem(storageName, JSON.stringify({
      accepted: true
    }))
		dispatch(Actions.acceptCookies());
	}

	function handleHideNotification() {
		dispatch(Actions.hideNotification());
	}
	
	return (
		<Fragment>
			{!acceptCookies ? (
				<Cookies isPro={isPro} onClick={handleAcceptCookies} />
			) : null}
			{showNotification ? (
				<Notification
					type={notificationType}
					text={notificationText}
					hide={handleHideNotification}
				/>
			) : null}
			{children}
		</Fragment>
	);
}

PrimaryContainer.propTypes = {
	router: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	router: state.router,
	general: state.general
});

export default connect(mapStateToProps)(PrimaryContainer);
