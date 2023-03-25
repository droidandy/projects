import React, { Fragment } from "react";
import { connect } from "react-redux";

import Preloader from "../../../../components/preloader";

// Wrapper component
import Body from "../../components/body";

// Page sections
import FaqBody from "../../components/faq/faq_body";
import FaqItemSection from "../../components/faq/faq_item_section";


import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {clientBlog} from "../../../../application/utils/apollo_client";


function FaqItemView(props) {
	const { router } = props;

	const url_parts = router.location.pathname.split('/');
	const faq_id = url_parts[url_parts.length - 1];

	const SHOW_FAQ = gql`
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
	  }
	`;

	const { loading, error, data } = useQuery(SHOW_FAQ, {client: clientBlog});

	let showFaq = [];

	if (data) {
		data.faqCategories.map(category => {
			category.faqs.map(faq => {
				if (faq.id === faq_id) {
					showFaq = faq;
					showFaq.faqCategory = category;
					return;
				}
			})
		})
	}

	return (
		<Body>
			<FaqBody>
				{loading ? <Preloader /> : <FaqItemSection faq={showFaq} />}
			</FaqBody>
		</Body>
	);
}

const mapStateToProps = state => ({
	router: state.router
});

export default connect(mapStateToProps)(FaqItemView);
