import React from "react";
import {makeStyles} from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import ReactMarkdown from "react-markdown";

import {
    Section,
    FaqPathSection,
    PathLink,
    PathTitle,
} from "./styles";

// const input = `# What is Taxgig? \n TaxGig is a marketplace for tax related services. Instead of wasting thousands of hours attempting to do it yourself, TaxGig offers to prepare them quickly, correctly and at a fair price by finding your perfect match from our pool of verified professionals. \n
//  \n 1. Answer simple questions and get a price upfront.\n
//  \n 2. Whether you choose our pre-selected Pro or decide to find one on your own - we guaranty that you will be working with verified professionals who suit your needs.  \n
//  \n 3. Upload all necessary documents that you need and your Pro suggests.\n
//  \n 4. Relax and enjoy your time, while your Pro does the rest.\n`

const useStyles = makeStyles(theme => ({
    root: {
        '>': {
            marginTop: theme.spacing(2),
        },
    },
}));

function FaqItemSection(props) {

    const {faq} = props;
    const classes = useStyles();

    return (
        <Section>
            <FaqPathSection>
                <div className={classes.root}>
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                        <PathLink to="/faq">FAQ</PathLink>
                        {faq.faqCategory &&
                        	<PathLink to={"/faq/category/" + faq.faqCategory.id}>{faq.faqCategory.title}</PathLink>
                        }
                        <PathTitle>{faq.title}</PathTitle>
                    </Breadcrumbs>
                </div>
                <ReactMarkdown escapeHtml={false} source={faq.content}/>
            </FaqPathSection>
        </Section>
    );
}

export default FaqItemSection;
