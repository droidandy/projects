import React, { Fragment } from "react";

// Wrapper component
import Body from "../../components/body";

// Page sections
import CareersHeaderSection from "../../components/careers/list/careers_header_section";
import CareersListSection from "../../components/careers/list/careers_list_section";
import GetInTouchSection from "../../components/careers/list/get_in_touch_section";

import { useQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";
import {clientBlog} from "../../../../application/utils/apollo_client";

const ALL_VACANCIES = gql`
	{
		careers
		{
		  id
		  title,
		  summary,
		  type,
		  career_section {
			id,
			title,
			description
		  }
		}
  }
`;

function CareersListView(props) {
	const { loading, error, data } = useQuery(ALL_VACANCIES, {client: clientBlog});

	const vacancies = data ? data.careers : [];

	function renderCareersList() {
		return (
			<Fragment>
				<CareersHeaderSection />
				<CareersListSection vacancies={vacancies} />
				<GetInTouchSection />
			</Fragment>
		);
	}

	return <Body children={renderCareersList()} />;
}

export default CareersListView;
