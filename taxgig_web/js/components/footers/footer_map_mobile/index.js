import React, { useState } from 'react';

import {
	FooterMapContainer,
	FooterMapBoxStatus,
	FooterMapBlockMobile,
	FooterMapTitleMobile,
	FooterMapBox,
	MapItem,
	MapLink,
	MapLinkSocial
	}
	from "./styles";

import Plus from "../../../components/images/plus"
import Minus from "../../../components/images/minus"

function FooterMapMobile(props) {

	// const [pagesPanelState, changepagesPanelState] = useState(false)
	// const [infoPanelState, changeinfoPanelState] = useState(false)
	// const [socialsPanelState, changesocialsPanelState] = useState(false)

	// function onClickPages() {
	// 	changepagesPanelState(!pagesPanelState)
	// }

	// function onClickInfo() {
	// 	changeinfoPanelState(!infoPanelState)
	// }

	// function onClickSocials() {
	// 	changesocialsPanelState(!socialsPanelState)
	//}

	const [expanded, setExpanded] = React.useState('');

	const handleChange = (panel) => (event, newExpanded) => {
		setExpanded(newExpanded ? panel : false);
	};

	const mapLinksHome = [
      { text: "Home", link: "/" },
      { text: "Be a Pro", link: "/pro" },
      { text: "About", link: "/about" },
      { text: "Careers", link: "/careers" }
    ];

    const mapLinksInfo = [
      { text: "FAQ", link: "/faq" },
      { text: "Safety", link: "/safety" },
      { text: "Privacy Policy", link: "/privacy" },
      { text: "Terms of Use", link: "/terms" },
      { text: "Press", link: "/press" },
      { text: "Tax Calculator", link: "/calc" }
    ];


    const mapLinksSocials = [
      { text: "Facebook", link: "https://www.facebook.com/TaxGig-2166201556966029/" },
      { text: "Linkedin", link: "https://www.linkedin.com/company/taxgig/about/" },
      { text: "Twitter", link: "https://twitter.com/taxgig1" },
      { text: "Youtube", link: "https://www.youtube.com/channel/UCRYKb-yzokbgSb78IGdtXFw/featured?view_as=subscriber" },
      { text: "Instagram", link: "https://www.instagram.com/taxgig/" }
    ];


	return(
		<FooterMapContainer>
			<FooterMapBlockMobile expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
				<FooterMapTitleMobile>
					<p>All pages</p>
					<FooterMapBoxStatus>
						{expanded === 'panel1' ? <Minus /> : <Plus /> }
					</FooterMapBoxStatus>
				</FooterMapTitleMobile>
				<FooterMapBox>
					{mapLinksHome.map(page => {
                    return (
                     	<MapItem key={page.text}>
                        	<MapLink to={page.link}>
                          		{page.text}
                        	</MapLink>
                      	</MapItem>
                    	);
                  	})}
					<MapLinkSocial href="/blog">Blog</MapLinkSocial>
				</FooterMapBox>
			</FooterMapBlockMobile>
			<FooterMapBlockMobile expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
				<FooterMapTitleMobile>
					<p>Information</p>
					<FooterMapBoxStatus>
						{expanded === 'panel2' ? <Minus /> : <Plus /> }
					</FooterMapBoxStatus>
				</FooterMapTitleMobile>
				<FooterMapBox>
					{mapLinksInfo.map(page => {
                    return (
                      <MapItem key={page.text}>
                        <MapLink to={page.link}>
                          {page.text}
                        </MapLink>
                      </MapItem>
                    );
                  })}
				</FooterMapBox>
			</FooterMapBlockMobile>
			<FooterMapBlockMobile expanded={expanded === 'panel3'} onChange={handleChange('panel3')}>
				<FooterMapTitleMobile>
					<p>Socials</p>
					<FooterMapBoxStatus>
						{expanded === 'panel3' ? <Minus /> : <Plus /> }
					</FooterMapBoxStatus>
				</FooterMapTitleMobile>
				<FooterMapBox>
					{mapLinksSocials.map(page => {
                    return (
                      <MapItem key={page.text}>
                        <MapLinkSocial href={page.link} target="_blank">
                          {page.text}
                        </MapLinkSocial>
                      </MapItem>
                    );
                  })}
				</FooterMapBox>
			</FooterMapBlockMobile>
		</FooterMapContainer>
	);
}

export default FooterMapMobile;

