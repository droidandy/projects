import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";

// Wrapper component
import Body from "../../components/body";
import Preloader from "../../../../components/preloader";

// Page sections
import FaqBody from "../../components/faq/faq_body";
import FaqCategorySection from "../../components/faq/faq_category_section";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

function FaqCategoryView(props) {
	const { landing, dispatch, router } = props;

	const url_parts = router.location.pathname.split('/');
	const category_id = url_parts[url_parts.length - 1];

	const FAQ_CATEGORY = gql`
	{
		 faqCategories {
		    faqs {
				id
				title
				content
			}
			id
			title
		  }
	}`;

	const { loading, error, data } = useQuery(FAQ_CATEGORY);

	let faqCategory = [];
	let faqs = [];

	if (data) {
		faqCategory = data.faqCategories.find(category => category.id === category_id);

		if (faqCategory) {
			faqs = faqCategory.faqs;
		}
	}

	return (
		<Body>
			<FaqBody>
				{loading ? (
					<Preloader />
				) : (
					<FaqCategorySection faqCategory={faqCategory} faqs={faqs} />
				)}
			</FaqBody>
		</Body>
	);
}

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	landing: state.landing,
	router: state.router
});

export default connect(mapStateToProps)(FaqCategoryView);
