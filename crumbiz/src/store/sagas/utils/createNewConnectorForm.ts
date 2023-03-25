import { IEntity } from '../../../types/interfaces';
import { uuid } from 'uuidv4';
import {
	OpportunityConnectorStatusesEnum,
	InteractionTypesEnum,
	TemplatesEnum,
	IntSubResponseTypesEnum
} from '../../../types/enums';

interface ICreateNewConnectorForm {
	entity: IEntity;
	oppId: string;
	userId: string;
	msgTextToEntity: string;
}
const createNewconnectorForm = (formInput: ICreateNewConnectorForm) => {
	const { entity, oppId, userId, msgTextToEntity } = formInput;

	let entityUserId = entity.id;

	const assignedUserId = uuid();
	const data: any = {
		opportunityId: oppId,
		ownerUserId: userId,
		opportunityStatusId: OpportunityConnectorStatusesEnum.PENDING_APPROVAL,
		interactions: [
			{
				timestamp: new Date(),
				fromUserId: userId,
				interactionTypeId: InteractionTypesEnum.SEND_INVITE,
				interactionTemplates: [
					{
						templateId: TemplatesEnum.INTERACTION_TEMPLATE_ID,
						body: msgTextToEntity
					}
				],
				interactionSubscribers: [
					{
						userId: entityUserId ? entityUserId : assignedUserId,
						IntSubResponseTypeId: IntSubResponseTypesEnum.YES_NO
					}
				]
			}
		]
	};

	if (entityUserId) {
		data.connectorUserId = entityUserId;
	} else {
		data.user1 = {
			...entity,
			id: assignedUserId,
			userAdditionals: [{ score: 4.1 }]
		};
	}
	return data;
};

export default createNewconnectorForm;
