import React, { useLayoutEffect, useState } from "react";

import { Footer, FooterWrapper } from "./styles";

import { size } from "../../components/styles";

// Components
import Remark from './footer_remark';
import FooterInfo from './footer_info'
import FooterMapDesktop from './footer_map_desktop'
import FooterMapMobile from './footer_map_mobile'

function LandingFooter(props) {

	const { general, dispatch } = props;

	const [deviceWidth, setDeviceWidth] = useState(0);

	useLayoutEffect(() => {
		function updateSize() {
			setDeviceWidth(window.innerWidth);
		}

		window.addEventListener("resize", updateSize);
		updateSize();
		return () => window.removeEventListener("resize", updateSize);
	}, []);

	return (
		<Footer>
			<FooterWrapper>
				<FooterInfo general={general} dispatch={dispatch} />
				{deviceWidth > size.laptop - 1 ? <FooterMapDesktop /> : <FooterMapMobile />}
			</FooterWrapper>	
			<Remark color='black' />
		</Footer>
	);
}

export default LandingFooter;
