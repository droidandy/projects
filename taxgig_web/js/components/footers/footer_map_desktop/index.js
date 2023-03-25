import React from 'react';

import {
	FooterRight,
	FooterMapBlock,
	FooterMapTitle,
	FooterMapBox,
	MapItem,
	MapLink,
    MapLinkSocial
	}
	from "./styles";

function FooterMapDesktop(props) {

	const mapLinksHome = [
      { text: "Home", link: "/" },
      { text: "Be a Pro", link: "/pro" },
      { text: "About", link: "/about" },
      { text: "Blog", link: "/blog" },
      { text: "Careers", link: "/careers" },
      { text: "Track My Refund", link: "/track_refund" }
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
		<FooterRight>
			<FooterMapBlock>
				<FooterMapTitle>All pages</FooterMapTitle>
				<FooterMapBox>
					{mapLinksHome.map(page => {
                    return (
                      <MapItem key={page.text}>
                        <MapLink to={page.link} activeClassName="active-link" exact>
                          {page.text}
                        </MapLink>
                      </MapItem>
                    );
                  })}
				</FooterMapBox>
			</FooterMapBlock>
			<FooterMapBlock>
				<FooterMapTitle>Information</FooterMapTitle>
				<FooterMapBox>
					{mapLinksInfo.map(page => {
                    return (
                      <MapItem key={page.text}>
                        <MapLink to={page.link} activeClassName="active-link" exact>
                          {page.text}
                        </MapLink>
                      </MapItem>
                    );
                  })}
				</FooterMapBox>
			</FooterMapBlock>
			<FooterMapBlock>
				<FooterMapTitle>Socials</FooterMapTitle>
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
			</FooterMapBlock>
		</FooterRight>
	);
}

export default FooterMapDesktop;

