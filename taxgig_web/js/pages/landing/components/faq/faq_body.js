import React, { useState, useEffect, Fragment } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";

import { useQuery, useLazyQuery } from "@apollo/react-hooks";
import { gql } from "apollo-boost";

import FaqHeaderSection from "./faq_header_section";
import FaqFooterSection from "./faq_footer_section";
import FaqCategoryItem from "./faq_category_section/faq_category_item";

import { ArticleBlock, NoArticleFound } from "./styles";

function FaqBody(props) {
	const { children, general, dispatch } = props;

	let [value, setValue] = useState("");
	let [results, setResults] = useState([]);

	const SEARCH_TITLES = gql`
		query searchTitles($title: String!) {
			searchTitles(title: $title) {
				id
				title
				content
				faqCategory {
					id
				}
			}
		}
	`;

	const [searchTitle, { loading, data }] = useLazyQuery(SEARCH_TITLES, {
		onCompleted(data) {
			console.log(data);
			setResults(data.searchTitles);
		}
	});

	function onChangeInput(e) {
		setValue(e.target.value);
		searchTitle({ variables: { title: e.target.value } });
	}

	function clearInput(e) {
		setValue("");
	}

	function resetSearchInput() {
		setValue("")
	}

	function renderContent() {
		if (value == "") {
			return children;
		} else if (value !== "" && results.length == 0) {
			return <NoArticleFound>No article found</NoArticleFound>;
		} else {
			return (
				<ArticleBlock>
					{results.map(faq => {
						return (
							<FaqCategoryItem
								id={faq.id}
								title={faq.title}
								key={faq.id}
								category_id={faq.faqCategory.id}
								description={faq.content}
								resetSearchInput={resetSearchInput}
							/>
						);
					})}
				</ArticleBlock>
			);
		}
	}

	return (
		<Fragment>
			<FaqHeaderSection value={value} onChangeInput={onChangeInput} clearInput={clearInput} />
			{renderContent()}
			<FaqFooterSection />
		</Fragment>
	);
}

const mapStateToProps = state => ({
	dispatch: state.dispatch,
	general: state.general
});

export default connect(mapStateToProps)(FaqBody);
