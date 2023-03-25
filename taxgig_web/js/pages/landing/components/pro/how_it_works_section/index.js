import React from "react";

import {
	HowItWorksContainer,
	StepsBlock,
	Step,
	StepContent,
	StepHelper,
	StepTitle,
	StepText,
	StepImageContainer,
	BlockBtn
} from "./styles";

// Images
import Step1Img from "./step1_img";
import Step2Img from "./step2_img";
import Step3Img from "./step3_img";

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import SubscribeButton from "../../subscribe_button";

function HowItWorksSection(props) {
	const { dispatch, landing, general } = props;
	const { isPro } = general;

	return (
		<HowItWorksContainer>
			<TitleWithSubtitle
				title="How it works"
				subtitle="Start working with clients in three easy steps"
				dark={isPro}
			/>
			<StepsBlock>
				<Step reverse>
					<StepContent>
						<StepHelper>STEP 1 OF 3</StepHelper>
						<StepTitle>Create a personilazed profile</StepTitle>
						<StepText>
							Tell us about your job preferences and your clients
							about yourself. Include anything you find necessary
							to make your profile outstanding.
						</StepText>
					</StepContent>
					<StepImageContainer>
						<Step1Img />
					</StepImageContainer>
				</Step>
				<Step>
					<StepContent>
						<StepHelper>STEP 2 OF 3</StepHelper>
						<StepTitle>Get verified by TaxGig</StepTitle>
						<StepText>
							We will use your PTIN and/or license number to
							verify your identity and listed credentials. It will
							be so fast, you won’t even notice.
						</StepText>
					</StepContent>
					<StepImageContainer>
						<Step2Img />
					</StepImageContainer>
				</Step>
				<Step reverse>
					<StepContent>
						<StepHelper>STEP 3 OF 3</StepHelper>
						<StepTitle>Start working and earn money</StepTitle>
						<StepText>
							Once verified, show your skills to your clients by
							doing what you are best at providing professional
							high-quality tax service.
						</StepText>
						{
							//<BlockBtn>
							//			<SubscribeButton landing={landing} dispatch={dispatch} />
							//		</BlockBtn>
						}
					</StepContent>
					<StepImageContainer>
						<Step3Img />
					</StepImageContainer>
				</Step>
			</StepsBlock>
		</HowItWorksContainer>
	);
}

export default HowItWorksSection;
