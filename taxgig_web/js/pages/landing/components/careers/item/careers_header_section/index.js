import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';

import {
	Section,
	CareersPathSection,
	CareersLink,
	CareersTitle
} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../../components/texts/title_with_subtitle";

const useStyles = makeStyles(theme => ({
  	root: {
   		'>': {
    	marginTop: theme.spacing(2),
    	},
  	},
}));

function CareersHeaderSection(props) {
	const { title } = props;

	const classes = useStyles();

	return (
		<Section>
			<TitleWithSubtitle title="Be a part of an amazing story" subtitle="Here is the list of open job positions we currently have." />
			<CareersPathSection>
				<div className={classes.root}>
				    <Breadcrumbs separator="›" aria-label="breadcrumb">
			       		<CareersLink to="/careers">
			   				Careers
			       		</CareersLink>	
			        	<CareersTitle>{title}</CareersTitle>
				    </Breadcrumbs>
				</div> 
			</CareersPathSection>	     
		</Section>
	);
}

export default CareersHeaderSection;