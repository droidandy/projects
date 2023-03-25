import React, {useState, useEffect, Fragment} from "react";

import {
    Section,
    SearchBox,
    SearchImage,
    SearchInput

} from "./styles";

//Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import SearchLens from "../../../../../components/images/search_lens"
import SearchClose from "../../../../../components/images/search_close"
import Helmet from "react-helmet";

function FaqHeaderSection(props) {
    const {value, onChangeInput, clearInput} = props;

    function renderImg() {
        if (value == '') {
            return <SearchImage>
                <SearchLens/>
            </SearchImage>
        } else {
            return <SearchImage onClick={clearInput}>
                <SearchClose/>
            </SearchImage>
        }
    }

    const el = document.querySelector("meta[name='description']");
    el.setAttribute('content', 'Let\'s solve your problem together.');

    return (
        <Fragment>
            <Helmet>
                <title>{"TaxGig Inc. - FAQ"}</title>
            </Helmet>
            <Section>
                <TitleWithSubtitle title="Frequently Asked Questions" subtitle="Let's solve your problem together."/>
                <SearchBox>
                    {renderImg()}
                    <SearchInput placeholder="Search for articles..." value={value} onChange={(e) => onChangeInput(e)}/>
                </SearchBox>
            </Section>
        </Fragment>
    );
}


export default FaqHeaderSection;
