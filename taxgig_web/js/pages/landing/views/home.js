import React, { Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

// Wrapper component
import Body from "../components/body";

// Page sections
import IntroSection from "../components/home/intro_section";
import HowItWorksSection from "../components/home/how_it_works_section";
import PopularServicesSection from "../components/home/popular_services_section";
import TaxgigForYouSection from "../components/home/taxgig_for_you_section";
import AdvantagesSection from "../components/home/advantages_section";
import ReadyToUseSection from "../components/home/ready_to_use_section";

function HomeView(props) {
	const { general, session, dispatch, landing } = props;
		
	function renderHome() {
		return (
			<Fragment>
				<IntroSection dispatch={dispatch} general={general} landing={landing} />
				<PopularServicesSection general={general} />
				<TaxgigForYouSection />
				<HowItWorksSection dispatch={dispatch} landing={landing} general={general} />
				<AdvantagesSection />
				<ReadyToUseSection dispatch={dispatch} landing={landing} general={general} />
			</Fragment>
		);
	}

	return <Body children={renderHome()} />;
}

HomeView.propTypes = {
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired,
	landing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general,
	landing: state.landing
});

export default connect(mapStateToProps)(HomeView);

