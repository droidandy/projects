import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import SafetySection from "../components/safety/safety_section";
import YourSecuritySection from "../components/safety/your_security_section";

function SafetyView(props) {
	function renderSafety() {
		return (
			<Fragment>
				<SafetySection />
				<YourSecuritySection />
			</Fragment>
		);
	}

	return <Body children={renderSafety()} />;
}

export default SafetyView;
