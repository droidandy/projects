import React, {Fragment} from "react";

import {
	Section,
	CareersHeaderBlock,
	CareersHeaderParagparh,
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../../components/texts/title_with_subtitle";
import Helmet from "react-helmet";

function CareersHeaderSection(props) {

	const el = document.querySelector("meta[name='description']");
	el.setAttribute('content', 'We hire people based on their talent, and we have no intention to suppress it by telling you what to do every step of the way. You are unique and are bringing something special to the business. We are here to help and let you shine.');

	return (
		<Fragment>
			<Helmet>
				<title>{"TaxGig Inc. - Careers"}</title>
			</Helmet>
			<Section>
				<TitleWithSubtitle title="Careers" subtitle="Search for our latest job opportunities." />
				<CareersHeaderBlock>
					<CareersHeaderParagparh>
						We hire people based on their talent, and we have no intention to suppress it by telling you what to do every step of the way. You are unique and are bringing something special to the business. We are here to help and let you shine.
					</CareersHeaderParagparh>
					<CareersHeaderParagparh>
						Even though we are ready to dedicate all the time to make TaxGig successful, we value personal time and do not prevent you from fulfilling it. Instead, we offer benefits plan, stock option, flexible vacation days and many more for you to enjoy your time as being part of our community.
					</CareersHeaderParagparh>
				</CareersHeaderBlock>
			</Section>
		</Fragment>
	);
}

export default CareersHeaderSection;
