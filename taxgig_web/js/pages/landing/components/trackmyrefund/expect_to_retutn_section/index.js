import React from "react";
import { Section, SectionTitle, SectionSubTitle, Card, Card2, Card3, CardsWrapper, CardsContainer, CardContent, CardNumber, CardTitle, CardSubtitle, ArrowNext, ArrowNext2 } from "./styles";
import "./styles_card.css";

function ExpectToReturnSection(props) {
	return (
		<Section>
			<SectionTitle>When to Expect Your Refund</SectionTitle>
			<SectionSubTitle>Be sure to check these three steps to see where your tax refund at</SectionSubTitle>
			<CardsWrapper >
				<CardsContainer id="CardsWrapper">
					<div>
						<Card>
							<CardContent>
								<CardNumber>01</CardNumber>
								<CardTitle>Within 24 hours</CardTitle>
								<CardSubtitle>If you used one of TaxGig Pros to file your taxes, you can track your refund within 24 hours.</CardSubtitle>
							</CardContent>
						</Card>
					</div>
					<ArrowNext>
						<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 1L17 5.13429L13 9.00024" stroke="white" stroke-width="1.4"/>
							<path d="M17 5L2.30777e-07 5" stroke="white" stroke-width="1.4" stroke-linejoin="round"/>
						</svg>
					</ArrowNext>
					<div>
						<Card2>
							<CardContent>
								<CardNumber>02</CardNumber>
								<CardTitle>Within 48 hours</CardTitle>
								<CardSubtitle>The IRS takes approximately 48 hours to approve your refund under standard processing procedure. Afterwards, it will be sent on its way.</CardSubtitle>
							</CardContent>
						</Card2>
					</div>
					<ArrowNext2>
						<svg width="18" height="10" viewBox="0 0 18 10" fill="none" xmlns="http://www.w3.org/2000/svg">
							<path d="M13 1L17 5.13429L13 9.00024" stroke="white" stroke-width="1.4"/>
							<path d="M17 5L2.30777e-07 5" stroke="white" stroke-width="1.4" stroke-linejoin="round"/>
						</svg>
					</ArrowNext2>
					<div>
						<Card3>
							<CardContent>
								<CardNumber>03</CardNumber>
								<CardTitle>Within 19 days</CardTitle>
								<CardSubtitle>Your tax refund deposit should have arrived after 19 days since the filing. Contact the IRS, if your have not received your refund within this time period.</CardSubtitle>
							</CardContent>
						</Card3>
					</div>
				</CardsContainer>
			</CardsWrapper>
		</Section>
	);
}

export default ExpectToReturnSection;
