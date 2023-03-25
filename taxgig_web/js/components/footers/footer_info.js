import React from 'react';

import { FooterInfoContainer, FooterLeft, DivContainer, LogoLink, FooterText, InputTitle } from "./styles";

import LogoWithWhiteText from '../images/logo_with_white_text'
import InputArrowRight from '../buttons/input_arrow_right'

function FooterInfo(props) {
	const { general, dispatch } = props;

	return(
		<FooterInfoContainer >
			<FooterLeft>
				<DivContainer>
					<LogoLink>
						<LogoWithWhiteText/>
					</LogoLink>	
					<FooterText>Join the best online marketplace for tax preparation services</FooterText>
				</DivContainer>
					<InputTitle>Stay in touch</InputTitle>
					<InputArrowRight general={general} dispatch={dispatch} />
				<DivContainer>
				</DivContainer>
			</FooterLeft>
		</FooterInfoContainer>
	);
}

export default FooterInfo;