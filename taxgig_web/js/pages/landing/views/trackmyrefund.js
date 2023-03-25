import React, { Fragment, useEffect, useCallback } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
// Wrapper component
import Body from "../components/body";

// Page sections
import IntroSection from "../components/trackmyrefund/intro_section";
import ExpectToReturnSection from "../components/trackmyrefund/expect_to_retutn_section";
import CheckRefundSection from "../components/trackmyrefund/check_refund_section";
import FAQSection from "../components/trackmyrefund/faq_section";
import ReadyToUseSection from "../components/trackmyrefund/ready_to_use_section";


function TrackMyRefundView(props) {
	const { dispatch, landing, general } = props;
	const element = document.querySelector("#CardsWrapper")
	const el = document.querySelector("meta[name='description']");
    el.setAttribute('content', 'Where is my Tax Refund? Three easy steps to check your refund status with TaxGig');

	const showExpectToReturnItemsInViewport = () => {
		const element = document.querySelector("#CardsWrapper")
		const scrollTop = document.querySelector("#body").scrollTop
		if(element) {
			if (window.innerWidth > 1024) {
				console.log(  scrollTop + window.innerHeight  )
				console.log(  scrollTop + window.innerHeight > 840 )
				if(  scrollTop + window.innerHeight   > 840 ) element.style.display="flex";
			} else {
				console.log(  scrollTop  )
				console.log(  scrollTop + window.innerHeight > 1150 )
				if(  scrollTop + window.innerHeight   > 1150 ) element.style.display="flex";
			}
		}
	}

	window.addEventListener("scroll", _ => showExpectToReturnItemsInViewport(), true);

	useEffect(() => {
		showExpectToReturnItemsInViewport();
	}, []);

	function renderPage() {
		return (
			<Fragment>
				<IntroSection dispatch={dispatch} general={general} landing={landing} />
				<ExpectToReturnSection general={general} />
				<CheckRefundSection dispatch={dispatch} general={general} landing={landing} />
				<FAQSection dispatch={dispatch} general={general} landing={landing} />
				<ReadyToUseSection dispatch={dispatch} landing={landing} general={general} />
			</Fragment>
		);
	}

	return <Body children={renderPage()} />;
}


TrackMyRefundView.propTypes = {
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired,
	landing: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general,
	landing: state.landing
});

export default connect(mapStateToProps)(TrackMyRefundView);
