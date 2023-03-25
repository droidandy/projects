import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";

// Wrapper component
import Body from "../components/body";

// Page sections
import IntroSection from "../components/pro/intro_section";
import PopularJobsSection from "../components/pro/popular_jobs_section";
import WhyJoinTaxgigSection from "../components/pro/why_join_taxgig_section";
import HowItWorksSection from "../components/pro/how_it_works_section";
import ReadyToUseSection from "../components/pro/ready_to_use_section";

import Actions from "../../../application/actions";


function ProView(props) {
	const { dispatch, landing, general } = props;

	// Sets/unsets reducer isPro, when user goes visits /pro url
	useEffect(() => {
		dispatch(Actions.toggleIsPro());
		return () => {dispatch(Actions.toggleIsPro());}
	}, []);

	function renderHome() {
		return (
			<Fragment>
				<IntroSection dispatch={dispatch} landing={landing} general={general} />
				<PopularJobsSection general={general} />
				<WhyJoinTaxgigSection dispatch={dispatch} landing={landing} general={general} />
				<HowItWorksSection dispatch={dispatch} landing={landing} general={general} />
				<ReadyToUseSection dispatch={dispatch} landing={landing} general={general} />
			</Fragment>
		);
	}

	return <Body children={renderHome()} />;	
}

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	landing: state.landing,
	general: state.general
});

export default connect(mapStateToProps)(ProView);
