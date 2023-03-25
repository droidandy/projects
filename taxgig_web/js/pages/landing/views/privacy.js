import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import PrivacyPolicy from "../components/privacy_policy/policy_section"
import {useQuery} from "@apollo/react-hooks";
import {getPolicyQuery} from "./blog/gqlQueries";
import {clientBlog} from "../../../application/utils/apollo_client";
import Preloader from "../../../components/preloader";
import Helmet from "react-helmet";

function PrivacyView(props) {

	const { data, loading, error } = useQuery(getPolicyQuery(), { client: clientBlog });

	if(data && data.privacyPolicy) {
		const el = document.querySelector("meta[name='description']");
		el.setAttribute('content', data.privacyPolicy.subTitle.substring(0, 159));
	}


	function renderPrivacy() {
		return (
			<Fragment>
				<Helmet>
					<title>{"TaxGig Inc. - Privacy policy"}</title>
				</Helmet>
				{loading ? (
					<Preloader />
				) : (
					<PrivacyPolicy data={data.privacyPolicy}/>
				)}
			</Fragment>
		);
	}

	return <Body children={renderPrivacy()} />;
}

export default PrivacyView;
