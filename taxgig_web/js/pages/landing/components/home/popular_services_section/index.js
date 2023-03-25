import React, { useState } from "react";
import Swiper from "react-id-swiper";
// import { css } from 'glamor';
import "./swiper.css"; 
//import 'react-id-swiper/lib/styles/css/swiper.css';


import { Section, CardsWrapper, SwiperCard } from "./styles";

import ServiceCard from "./service_card";

// Images
import LandingList from "../../../../../components/images/landing_list";
import LandingBuilding from "../../../../../components/images/landing_building";
import LandingCalculator from "../../../../../components/images/landing_calculator";
import LandingDoc from "../../../../../components/images/landing_doc";

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";

function PopularServicesSection(props) {
	const [swiper, updateSwiper] = useState(null);

	const { general } = props;
	const { isMobile } = general;



	let swiperParams;
	if (isMobile) {
		swiperParams = {
			resistanceRatio: 0, 
			slidesPerView: 1,
			spaceBetween: 30,
			simulateTouch: true,
			pagination: {
				el: ".swiper-pagination",
				type: "bullets",
				clickable: true
			}
		};
	} else {
		swiperParams = {
			resistanceRatio: 0, 
			slidesPerView: 4,
			spaceBetween: 24,
			simulateTouch: true,
			slideClass: 'custom-swiper',
			containerClass: 'custom-swiper-container ',
		};
	}

	// const CustomSwiper = {
	// 	width: "300px",
	// 	margin: "30px auto",
	// 	backgroundColor: "#44014C",
	// 	minHeight: "200px",
	// 	boxSizing: "border-box"
	// }

				// slideClass: `swiper-container ${css({ boxShadow: '0px 5px 10px rgba(159, 167, 192, 0.07)' })}`,


	return (
		<Section>
			<TitleWithSubtitle
				title="Popular services"
				subtitle="Hire verified freelance CPAs, EAs and Attorneys and get free cost estimates"
			/>
		<CardsWrapper>
			<Swiper getSwiper={updateSwiper} {...swiperParams}>
				<div>
					<ServiceCard
						title="Individual Tax Return"
						price="50$"
						img={<LandingList />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Business Tax Return"
						price="150$"
						img={<LandingBuilding />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Bookkeeping & Accounting"
						price="80$"
						img={<LandingCalculator />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Sales Tax"
						price="45$"
						img={<LandingDoc />}
					/>
				</div>
			</Swiper>
		</CardsWrapper>
		</Section>
	);
}

export default PopularServicesSection;
