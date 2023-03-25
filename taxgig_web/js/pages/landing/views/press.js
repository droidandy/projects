import React, {Fragment} from "react";

import Preloader from "../../../components/preloader";
// Wrapper component
import Body from "../components/body";

// Page sections
import TaxgigInTheNewsSection from "../components/press/taxgig_in_the_news_section";
import MediaResourcesSection from "../components/press/media_resources_section";
import {useQuery} from "@apollo/react-hooks";
import {gql} from "apollo-boost";
import {clientBlog} from "../../../application/utils/apollo_client";
import Helmet from "react-helmet";

const PRESS_ARTICLES = gql`
	{
		pressArticles 
		{
 			id
			title
			url
			imgUrl
			previewText
			author
			published_at
		}
	}
`;

const NEWS_MEDIA = gql`
	{
		newsMedias
			{
			  id
			  title,
			  content,
			  file {
				url
			  }
			}
	  }`;

function PressView(props) {
    const {loading, error, data} = useQuery(PRESS_ARTICLES, {client: clientBlog});

    const pressArticles = data ? data.pressArticles : [];

    const el = document.querySelector("meta[name='description']");
    el.setAttribute('content', 'See what other sources say about us.');

    function renderPress() {
        return (
            <Fragment>
                <Helmet>
                    <title>{"TaxGig Inc. - TaxGig in the News"}</title>
                </Helmet>
                {loading ? (
                    <Preloader/>
                ) : (
                    <TaxgigInTheNewsSection pressArticles={pressArticles}/>
                )}

                <MediaResourcesSection/>
            </Fragment>
        );
    }

    return <Body children={renderPress()}/>;
}

export default PressView;
