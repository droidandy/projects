import React, { Fragment, useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import Swiper from "react-id-swiper";
import "swiper/css/swiper.css";

// Components
import LandingHeader from "../../components/headers/landing";
import LandingMobHeader from "../../components/headers/landing_mob";
import LandingMobMenu from "../../components/landing_mob_menu";
import Notification from "../../components/notification";

// Styles
import {
	size,
	LandingMainContainer,
	LandingBody
} from "../../components/styles";

// Pages
import HomeView from "../../pages/landing/views/home";
import ProView from "../../pages/landing/views/pro";
import AboutView from "../../pages/landing/views/about";
import ConsultationView from "../../pages/landing/views/consultation";
import FaqListView from "../../pages/landing/views/faq/list";
import FaqCategoryView from "../../pages/landing/views/faq/category";
import FaqItemView from "../../pages/landing/views/faq/item";
import TrackMyRefundView from "../../pages/landing/views/trackmyrefund";
import CareersListView from "../../pages/landing/views/careers/list";
import CareersItemView from "../../pages/landing/views/careers/item";
import PrivacyView from "../../pages/landing/views/privacy";
import TermsView from "../../pages/landing/views/terms";
import SafetyView from "../../pages/landing/views/safety";
import CalcView from "../../pages/landing/views/calc";
import PressView from "../../pages/landing/views/press";
import NotFoundView from "../../pages/landing/views/not_found";

import Actions from "../actions";
import { BlogView } from "../../pages/landing/views/blog/blog";
import BlogItemView from "../../pages/landing/views/blog/blogItem";


function LandingContainer(props) {
	const [swiper, updateSwiper] = useState(null);
	const [showMobMenu, updateShowMobMenu] = useState(false);

	const ref = useRef(null);

	const { dispatch, general } = props;
	const { isMobile, isPro } = general;

	// Update state, when swiper position changes
	useEffect(() => {
		if (swiper !== null && isMobile) {
			swiper.on("slideChangeTransitionEnd", e =>
				updateShowMobMenu(swiper.activeIndex == 1 ? true : false)
			);
		}
	}, [swiper]);

	const location = useLocation();

	useEffect(() => {
		ref.current.scrollTop = 0;
	}, [location]);

	// Switch between mobile content and menu
	const toggleSlide = () => {
		if (swiper !== null) {
			swiper.slideTo(swiper.activeIndex == 1 ? 0 : 1);
		}
	};

	function hideMobMenu() {
		if (swiper !== null) {
			swiper.slideTo(0);
		}
	}

	// Landing routes
	const renderRoutes = () => {
		return (
			<Switch>
				<Route exact path="/" component={HomeView} />
				<Route path="/pro" component={ProView} />
				<Route path="/privacy" component={PrivacyView} />
				<Route path="/terms" component={TermsView} />
				<Route path="/about" component={AboutView} />
				<Route path="/safety" component={SafetyView} />
				<Route path="/calc" component={CalcView} />
				<Route path="/press" component={PressView} />
				<Route path="/blog" component={BlogView} exact />
				<Route path="/blog/:id" component={BlogItemView} />

				<Route exact path="/faq" component={FaqListView} />
				<Route exact path="/consultation" component={ConsultationView} />
				<Route
					exact
					path="/faq/category/:faq_category_id"
					component={FaqCategoryView}
				/>
				<Route
					path="/faq/category/:faq_category_id/:faq_item_id"
					component={FaqItemView}
				/>

				<Route exact path="/careers" component={CareersListView} />
				<Route exact path="/track_refund" component={TrackMyRefundView} />
				
				<Route
					exact
					path="/careers/:vacancy_id"
					component={CareersItemView}
				/>

				<Route exact path="/not_found" component={NotFoundView} />

				<Redirect from="*" to="/not_found" />
			</Switch>
		);
	};

	// Mobile swiper config
	const swiperParams = {
		resistanceRatio: 0, // resistance: false doesn't work
		simulateTouch: true
	};

	let header, body;

	if (isMobile) {
		header = (
			<LandingMobHeader
				active={showMobMenu}
				toggleSlide={toggleSlide}
				hideMobMenu={hideMobMenu}
				isPro={isPro}
			/>
		);
		body = (
			<Swiper getSwiper={updateSwiper} {...swiperParams}>
				<LandingBody id="body" ref={ref} isPro={isPro}>{renderRoutes()}</LandingBody>
				<LandingBody isPro={isPro}>
					<LandingMobMenu isPro={isPro} hideMobMenu={hideMobMenu} />
				</LandingBody>
			</Swiper>
		);
	} else {
		header = <LandingHeader isPro={isPro} />;
		body = <LandingBody id="body" ref={ref} isPro={isPro}>{renderRoutes()}</LandingBody>;
	}

	return (
		<LandingMainContainer>
			{header}
			{body}
		</LandingMainContainer>
	);
}

LandingContainer.propTypes = {
	router: PropTypes.object.isRequired,
	dispatch: PropTypes.func.isRequired,
	general: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	router: state.router,
	general: state.general
});

export default connect(mapStateToProps)(LandingContainer);
