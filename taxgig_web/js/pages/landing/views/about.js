import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import AboutSection from "../components/about/about_section";

function AboutView(props) {
	function renderAbout() {
		return (
			<Fragment>
				<AboutSection />
			</Fragment>
		);
	}

	return <Body children={renderAbout()} />;
}

export default AboutView;
