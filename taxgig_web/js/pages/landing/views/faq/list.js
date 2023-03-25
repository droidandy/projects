import React, { Fragment, useEffect } from "react";
import { connect } from "react-redux";

import Preloader from "../../../../components/preloader";

// Wrapper component
import Body from "../../components/body";

// Page sections
import FaqBody from "../../components/faq/faq_body";
import FaqCategoryListSection from "../../components/faq/faq_category_list_section";

import Actions from "../../../../application/actions";
import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {clientBlog} from "../../../../application/utils/apollo_client";

const FAQ_CATEGORIES = gql`
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

function FaqListView(props) {
	const { dispatch } = props;
	const { loading, error, data } = useQuery(FAQ_CATEGORIES, {client: clientBlog});

	const faqCategories = data ? data.faqCategories : [];

	// // if (!data.allFaqCategories) {
	// // 	dispatch(Actions.showNotification("Graphql error", "error"))
	// // }

	// function renderFaqList() {
	// 	return (
	// 		<Fragment>
	// 			<FaqHeaderSection />
	// 			{loading ? (
	// 				<Preloader />
	// 			) : (
	// 				<FaqCategoryListSection allFaqCategories={faqCategories} />
	// 			)}
	// 			<FaqFooterSection />
	// 		</Fragment>
	// 	);
	// }

	return (
		<Body>
			<FaqBody>
				{loading ? (
					<Preloader />
				) : (
					<FaqCategoryListSection faqCategories={faqCategories} />
				)}
			</FaqBody>
		</Body>
	);
}

const mapStateToProps = state => ({
	dispatch: state.dispatch
});

export default connect(mapStateToProps)(FaqListView);
