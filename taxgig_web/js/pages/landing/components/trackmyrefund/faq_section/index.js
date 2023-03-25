import React from "react";

import {
	Section,
	LeftBlock,
	LeftBlockTitle,
	RightBlock,
} from "./styles";
import FAQSectionImage from "./img";
import QuestionItems from "./question_item"

function IntroSection(props) {

	let data = [
    	{
        title: `When will I get my tax refund?`, 
        content: `On the regular basis, the IRS processes refunds and payments within 21 days since the initial filing. Furthermore, it is advised to fill your taxes online, as paper filers may wait for their tax return longer.

		Depending on how you filed your taxes and whether requested a direct deposit or a paper check for the refund, it will directly affect how quick your refund should arrive. The busiest time will be for those who filed their refunds closer to the deadline (April 15th), as the IRS experiences the highest load of tax refunds at that time. `
      }, {
        title: "What happens with my federal tax return?", 
        content: `Once you filed your tax return, you may wonder when to expect it. The processing time and release time of your tax refund may vary. However, most tax returns go through the same processing stages. 

		Once your return is received and accepted by the IRS, you refund is in “return received” stage. If you chose to e-file it, the receipt will be almost instant. Unless there  are some errors or oversights on the return, the acceptance will be fast. Next step will be the approval of your refund by the IRS. Once it’s done, the IRS agree to send you the listed amount on your return. Finally, your return is on its way and should be deposited to your account  within 21 days.  
		
		You will be able to track your refund within 24 hours since the IRS receives it. If you chose to file in paper form, the tool to track your refund will be available in four weeks. Once the refund is approved, the IRS tool will estimate the date when to expect your return. If you are unable t track it online, you may use the IRS's Refund Hotline at 1-800-829-1954.`
      },{
        title: "What may caused a delay on my refund?", 
        content: `Generally, the tax refund is processed within the standard time. However, there may be a few situations that may delay your return. Let’s look deeper into a few examples that may caused it:

		1. If you chose paper filing, the IRS usually takes longer to precess these types of returns, The are still obliged to input your returns online via their computer system. Even though most returns are eligible for e-filing, certain tax situations may require a paper filing method. 
		
		2. The IRS cross-checks all the submitted information from other sources and your previous tax returns. If some of your information provided is inconsistent (such as social security number, legal name or info about your spouse, children, dependents and etc.), the IRRS may take more time to dig deeper into your tax return. This is a helpful and standard policy to prevent tax fraud.  
		Furthermore, if you missed filing some additionally required forms, the IRS may send you a notice that your tax return information is incomplete. The best way to solve it is to send an amended tax return once you are aware of the issue. 

		3. Make sure to file your taxes once the IRS officially starts to accept tax returns (late January). Filing before the date may result in rejection by the IRS.

		4. Same is applicable for filing lately. As identity thieves may use your information to receive your tax refund on their behalf. If such happens, the IRS will investigate the case, which may cause a delay from a few week to up to a year. 

		5. If there were some miscalculations in your form, the IRS may require you to correct it. Therefore, hiring a professional will ease your pain with filing and prevent any delays that may be causes by simple mistakes. TaxGig Pros are always here to help. `
      }
    ];

	return (
		<Section>
			<LeftBlock>
				<LeftBlockTitle>FAQ</LeftBlockTitle>
				<QuestionItems data={data} />
			</LeftBlock>
			<RightBlock>
				<FAQSectionImage alt={'FAQ tax refund'} />
			</RightBlock>
		</Section>
	);
}

export default IntroSection;
