import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import Message from "../components/not_found";

function NotFoundView(props) {
	function renderNotFound() {
		return <Message />;
	}

	return <Body children={renderNotFound()} />;
}

export default NotFoundView;
