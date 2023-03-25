import React from "react";
import ReactMarkdown from "react-markdown";

import {
    Section,
    CareersCategory,
    ContainerButton,
    CareersPosition,
    TextQualifications,
    BlockList,
    BlockListItem,
    AboutPositionBlock,
    AboutPositionHeader,
    AboutPositionParagrarh,
    TextResponsibilities
} from "./styles";

import FilledButtonArrowRight from "../../../../../../components/buttons/filled_button_arrow_right";


function CareersFullItemSection(props) {
    const {vacancy} = props;

    return (
        <Section>
            <CareersCategory>{vacancy.type}</CareersCategory>
            <CareersPosition>{vacancy.title}</CareersPosition>
            <ReactMarkdown source={vacancy.summary}/>
            {vacancy.career_section &&
				<div>
					{vacancy.career_section.map(career => {
						return (
							<div key={career.id}>
								<h4>{career.title}</h4>
                                <ReactMarkdown source={career.description}/>
							</div>
						)
					})}
				</div>
            }
        </Section>
    );
}

export default CareersFullItemSection;
