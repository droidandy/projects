import React, { useState } from "react";
import Swiper from "react-id-swiper";
// import { css } from 'glamor'

import { Section, CardsWrapper, SwiperCard } from "./styles";

import ServiceCard from "./service_card";

// Images
import LandingListPro from "../../../../../components/images/landing_list_pro";
import LandingBuildingPro from "../../../../../components/images/landing_building_pro";
import LandingCalculatorPro from "../../../../../components/images/landing_calculator_pro";
import LandingDocPro from "../../../../../components/images/landing_doc_pro";

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";

function PopularJobsSection(props) {
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
			containerClass: 'custom-swiper-container',
		};
	}

				// slideClass: `swiper-container ${css({ boxShadow: '0px 5px 10px rgba(159, 167, 192, 0.07)' })}`,


	return (
		<Section>
			<TitleWithSubtitle
				title="Popular jobs"
				subtitle="Check out the list of services provided via TaxGig platform."
			/>
		<CardsWrapper>
			<Swiper getSwiper={updateSwiper} {...swiperParams}>
				<div>
					<ServiceCard
						title="Individual Tax Return"
						price="$183"
						img={<LandingListPro />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Business Tax Return"
						price="$751"
						img={<LandingBuildingPro />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Bookkeeping & Accounting"
						price="$143"
						img={<LandingCalculatorPro />}
					/>
				</div>
				<div>
					<ServiceCard
						title="Sales Tax"
						price="45$"
						img={<LandingDocPro />}
					/>
				</div>
			</Swiper>
		</CardsWrapper>
		</Section>
	);
}

export default PopularJobsSection;
