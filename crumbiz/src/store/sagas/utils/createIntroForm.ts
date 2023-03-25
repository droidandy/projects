import {
	IUserData,
	IEntityData,
	IIntroMessage,
	IAttachmentsObj,
	IAttachment
} from '../../../types/interfaces';
import { uuid } from 'uuidv4';
import {
	TargetStatusesEnum,
	InteractionTypesEnum,
	IntSubResponseTypesEnum,
	TemplatesEnum,
	InteractionTemplateFieldsEnum,
	AttachmentTypesEnum
} from '../../../types/enums';
import { readFile } from '../../../utils';
import {
	IFileAttachment,
	ILinkAttachment,
	IEntity
} from '../../../types/interfaces';

interface IConnectTargetData {
	id?: string;
	opportunityConnectorId: string;
	targetUserId?: string;
	user?: Partial<IUserData>;
	interactions?: Array<{}>;
	opportunityTargetStatusId: string;
}

type Lol = { [key in AttachmentTypesEnum]: IAttachment };
interface IIntroFormInput {
	id: string;
	entity: IEntity;
	currentUserId: string;
	recordingBase64: string;
	introMessage: IIntroMessage;
	attachments: Lol;
}

const createIntroForm = async (formInput: IIntroFormInput) => {
	const {
		id: opportunityConnectorId,
		entity,
		currentUserId,
		recordingBase64,
		introMessage,
		attachments
	} = formInput;

	const data: IConnectTargetData = {
		opportunityConnectorId,
		opportunityTargetStatusId: TargetStatusesEnum.PENDING
	};
	const generatedTargetId = uuid();

	if (entity.id) {
		data.targetUserId = entity.id;
	} else {
		const userObj: Partial<IUserData> = {
			...entity,
			id: generatedTargetId,
			userAdditionals: [{ score: 4.1 }]
		};

		data.user = userObj;
	}

	data.interactions = [
		{
			timestamp: new Date(),
			fromUserId: currentUserId,
			interactionTypeId: recordingBase64 ? InteractionTypesEnum.VOICE_INTRODUCTION : InteractionTypesEnum.INTRODUCTION,

			interactionSubscribers: [
				{
					userId: entity.id ? entity.id : generatedTargetId,
					IntSubResponseTypeId: IntSubResponseTypesEnum.YES_NO
				}
			]
		}
	];
	// If the intro is a record
	if (recordingBase64) {
		// @ts-ignore
		data.interactions[0].interactionTemplates = [
			{
				templateId: TemplatesEnum.SOUND_RECORDER,
				body: 'Voice Introduction', // Body is required, igor said to put a space
				interactionTemplateFields: [
					{
						templateFieldId: InteractionTemplateFieldsEnum.SOUND_RECORDER,
						stringValue: 'audio/aac',
						fileTextValue: recordingBase64
					}
				]
			}
		];
	}
	// If the intro is a typed message / ready template
	if (introMessage.body && !recordingBase64) {
		// @ts-ignore
		data.interactions[0].interactionTemplates = [
			{
				body: introMessage.body,
				templateId: TemplatesEnum.SENT_INTRODUCTION
			}
		];
	}

	// Posting Attachments - NOT CONNECTED AT THE MOMENT, ditched for another task
	let base64File: string | undefined;
	if (attachments[AttachmentTypesEnum.FILE]) {
		base64File = await readFile(
			(attachments[AttachmentTypesEnum.FILE].content as IFileAttachment).uri
		);
	}
	//@ts-ignore
	const attachmentsInteraction = [];
	Object.entries(attachments).forEach(
		//@ts-ignore
		([key, value]: [AttachmentTypesEnum, IAttachment]) => {
			const InteractionTemplateIdMapper = {
				[AttachmentTypesEnum.FILE]:
					InteractionTemplateFieldsEnum.FILE_ATTACHMENT,
				[AttachmentTypesEnum.LINK]:
					InteractionTemplateFieldsEnum.URL_ATTACHMENT,
				[AttachmentTypesEnum.PHONE_NUMBER]: '',
				[AttachmentTypesEnum.LOCATION]: ''
			};

			const stringValueMapper = {
				[AttachmentTypesEnum.FILE]: (value.content as IFileAttachment).type,
				[AttachmentTypesEnum.LINK]: 'url',
				[AttachmentTypesEnum.PHONE_NUMBER]: '',
				[AttachmentTypesEnum.LOCATION]: ''
			};

			const fileTextValueMapper = {
				[AttachmentTypesEnum.FILE]: base64File,
				[AttachmentTypesEnum.LINK]: (value.content as ILinkAttachment).linkName
					? (value.content as ILinkAttachment).link
					: value.content
			};

			const interactionTemplate = {
				templateId: InteractionTypesEnum.SEND_INVITE, // Igor said to use this one for attachment
				body: value.title,
				interactionTemplateFields: [
					{
						//@ts-ignore
						templateFieldId: InteractionTemplateIdMapper[key],

						stringValue: stringValueMapper[key],
						//@ts-ignore
						fileTextValue: fileTextValueMapper[key]
					}
				]
			};
			attachmentsInteraction.push(interactionTemplate);
		}
	);
	return data;
};

export default createIntroForm;
