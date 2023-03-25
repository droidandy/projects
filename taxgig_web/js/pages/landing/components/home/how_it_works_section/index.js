import React from "react";

import {
	Section,
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
import Step1Img from './step1_img';
import Step2Img from './step2_img';
import Step3Img from './step3_img';
import Step4Img from './step4_img';
import Step5Img from './step5_img';

// Components
import TitleWithSubtitle from "../../../../../components/texts/title_with_subtitle";
import SubscribeButton from "../../subscribe_button";


function HowItWorksSection(props) {

	const { dispatch, landing, general } = props;

	return (
		<Section>
			<TitleWithSubtitle title="How it works" subtitle="Get your project done in five easy steps" />
			<StepsBlock>
				<Step>
					<StepContent>
						<StepHelper>STEP 1 OF 5</StepHelper>
						<StepTitle>Select what kind of service you need</StepTitle>
						<StepText>Pros on TaxGig have a wide expertise in Tax Returns, Sales Tax, Bookkeeping and in many other revenue services and are here to help you.</StepText>
					</StepContent>
					<StepImageContainer><Step1Img /></StepImageContainer>
				</Step>
				<Step reverse>
					<StepContent>
						<StepHelper>STEP 2 OF 5</StepHelper>
						<StepTitle>Answer simple questions and get a free estimate</StepTitle>
						<StepText>It only takes 40 seconds to get you connected with the most efficient tax Pros.</StepText>
					</StepContent>
					<StepImageContainer><Step2Img /></StepImageContainer>
				</Step>
				<Step>
					<StepContent>
						<StepHelper>STEP 3 OF 5</StepHelper>
						<StepTitle>Get instantly matched to a Pro or select the one you like</StepTitle>
						<StepText>Once you describe your project, the choice is yours - get matched to our pre-selected Pro or search for the one you like.</StepText>
					</StepContent>
					<StepImageContainer><Step3Img /></StepImageContainer>
				</Step>
				<Step reverse>
					<StepContent>
						<StepHelper>STEP 4 OF 5</StepHelper>
						<StepTitle>Upload documents and reap the benefits</StepTitle>
						<StepText>When matched, upload your statements, previous forms and any other relevant documents for your Pro to analyze them and deliver the best results.</StepText>
					</StepContent>
					<StepImageContainer><Step4Img /></StepImageContainer>
				</Step>
				<Step>
					<StepContent>
						<StepHelper>STEP 5 OF 5</StepHelper>
						<StepTitle>Get your project done!</StepTitle>
						<StepText>When all information is provided, you can sit down and relax. Let your Pro do the rest while you do whatever you want to do.</StepText>
						<BlockBtn>
							<SubscribeButton landing={landing} dispatch={dispatch} general={general} />
						</BlockBtn>
					</StepContent>
					<StepImageContainer><Step5Img /></StepImageContainer>
				</Step>
			</StepsBlock>
		</Section>
	);
}

export default HowItWorksSection;
