import React from 'react';

import { FooterRemark, FooterRemarkLink } from "./styles";

function Remark(props) {
	const { color } = props;

	const todayDate = new Date();
	const currentYear = todayDate.getFullYear();

	return(
		<FooterRemark color={color}>
			{currentYear} <FooterRemarkLink href="/">TaxGig Inc</FooterRemarkLink>.
			All rights reserved.
		</FooterRemark>
	);
}

export default Remark;
