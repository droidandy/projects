import React, { Fragment } from "react";

// Wrapper component
import Body from "../components/body";

// Page sections
import Terms from "../components/terms/terms_section"
import {useQuery} from "@apollo/react-hooks";
import {getTermsQuery} from "./blog/gqlQueries";
import {clientBlog} from "../../../application/utils/apollo_client";
import Preloader from "../../../components/preloader";
import Helmet from "react-helmet";

function TermsView(props) {

	const { data, loading, error } = useQuery(getTermsQuery(), { client: clientBlog });

	if(data && data.term) {
		const el = document.querySelector("meta[name='description']");
		el.setAttribute('content', data.term.subTitle.substring(0, 159));
	}

	function renderTerms() {
		return (
			<Fragment>
				<Helmet>
					<title>{"TaxGig Inc. - Terms of use"}</title>
				</Helmet>
				{loading ? (
					<Preloader />
				) : (
					<Terms data={data.term} />
				)}
			</Fragment>
		);
	}

	return <Body children={renderTerms()} />;
}

export default TermsView;
