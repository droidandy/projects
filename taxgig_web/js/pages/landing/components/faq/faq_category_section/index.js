import React, {Fragment} from "react";
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {
	Section,
	FaqPathSection,
	PathLink,
	PathTitle,
	ArticleBlock
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import FaqListItem from "../faq_list_item"
import FaqCategoryItem from "./faq_category_item"
import Helmet from "react-helmet";

const useStyles = makeStyles(theme => ({
  	root: {
   		'>': {
    	marginTop: theme.spacing(2),
    	},
  	},
}));

function FaqCategorySection(props) {

	const classes = useStyles();
	const { faqCategory, faqs } = props;

	return (
		<Section>
			<FaqPathSection>
				<div className={classes.root}>
				    <Breadcrumbs separator="›" aria-label="breadcrumb">
			       		<PathLink to="/faq">FAQ</PathLink>
						{faqCategory &&
							<PathTitle>{faqCategory.title}</PathTitle>
						}
				    </Breadcrumbs>
				</div>
			</FaqPathSection>
			{faqCategory &&
				<FaqListItem
					title={faqCategory.title}
					count={faqCategory.faqs ? faqCategory.faqs.length : 0}
					text="Written by Taxgig team"
					style="background: #e2dddd;"
				/>
			}
			<ArticleBlock>
				{faqs.map(faq => {
					return (
						<FaqCategoryItem
							id={faq.id}
							title={faq.title}
							key={faq.id}
							category_id={faqCategory.id}
							description={faq.content}
						/>
					)
				})}
			</ArticleBlock>
		</Section>
	);
}

export default FaqCategorySection;
