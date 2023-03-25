import React, { Fragment } from "react";
import { connect } from "react-redux";

import Preloader from "../../../../components/preloader";

// Wrapper component
import Body from "../../components/body";

// Page sections
import CareersHeaderSection from "../../components/careers/item/careers_header_section"
import CareersFullItemSection from "../../components/careers/item/careers_full_item_section"
import GetInTouchSection from "../../components/careers/list/get_in_touch_section"

import { useQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import {clientBlog} from "../../../../application/utils/apollo_client";


function CareersItemView(props) {
	const { router } = props;

	const url_parts = router.location.pathname.split('/');
	const vacancy_id = url_parts[url_parts.length - 1];

	const SHOW_VACANCY = gql`
	  {
		  career(id: "${vacancy_id}"){
			id
			title
			type
			summary
			career_section {
			  id,
			  title,
			  description
			}
		  }
		}`;

	const { loading, error, data } = useQuery(SHOW_VACANCY, {client: clientBlog});

	const vacancy = data ? data.career : [];

	function renderCareersItem() {
		return (
			<Fragment>
				<CareersHeaderSection title={vacancy.title} />
				{loading ? <Preloader /> : <CareersFullItemSection vacancy={vacancy} />}
				<GetInTouchSection />
			</Fragment>
		);
	}

	return <Body children={renderCareersItem()} />;
}

const mapStateToProps = state => ({
	router: state.router
});

export default connect(mapStateToProps)(CareersItemView);
