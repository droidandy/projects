import React from "react";

import {
    PolicyBlock,
    LeftNavigation,
    RightContent,
    StaticBlockContainer,
    StaticSubTitle,
    StaticBlockContent,
    NavLink
} from "./styles";
import ReactMarkdown from "react-markdown";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";

function PolicySection(props) {

    const {data} = props;

    const scrollTo = (hash) => {
        document.getElementById(hash).scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    }

    return (
        <StaticBlockContainer>
            <PolicyBlock>
                <TitleWithSubtitle title={data.title} />
                <StaticSubTitle>{data.subTitle}</StaticSubTitle>
            </PolicyBlock>
            <StaticBlockContent>
                <LeftNavigation>
                    {data.privacy_section.map(sec => {
                        return (
                            <NavLink key={sec.hash} onClick={() => scrollTo(sec.hash)}>
                                {sec.title}
                            </NavLink>
                        )
                    })}
                </LeftNavigation>
                <RightContent>
                    <PolicyBlock>
                        <ReactMarkdown source={data.description}/>
                        {data.privacy_section.map(sec =>
                            <div key={sec.hash}>
                                <h3 id={sec.hash}>{sec.title}</h3>
                                <ReactMarkdown source={sec.description} />
                            </div>)}
                    </PolicyBlock>
                </RightContent>
            </StaticBlockContent>
        </StaticBlockContainer>
    );
}

export default PolicySection;
