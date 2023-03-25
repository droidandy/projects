import RestApi from '../RestApi';
import { InteractionTypesEnum } from '../../../types/enums';
import crumbizApi from '../crumbizInstance';

interface IInteractionTypes {}

interface IGetIntroMessagePayload {
	oppId: string;
	TemplateType: InteractionTypesEnum;
}

class InteractionsEP extends RestApi<IInteractionTypes> {
	routeName = 'Interactions';

	// This method gets the first message sent to connector (when opp created) or to target (when sending an intro)
	getIntroMessage = async ({
		oppId,
		TemplateType
	}: IGetIntroMessagePayload) => {
		try {
			const res = await crumbizApi.get(`${this.routeName}`, {
				params: {
					$filter: `(opportunityConnector/OpportunityId eq ${oppId} or opportunityTarget/opportunityConnector/OpportunityId eq ${oppId}) and (interactionTypeId eq ${TemplateType} or interactionTypeId eq ${InteractionTypesEnum.VOICE_INTRODUCTION})`,
					$expand: `interactionTemplates($expand=interactionTemplateFields)`
				}
			});
			return res.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};

	sendMessageInteraction = async () => {
		try {
		} catch (ex) {}
	};
}

const interactionsEP = new InteractionsEP();

export default interactionsEP;
