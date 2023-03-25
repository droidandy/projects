export enum EntityEnum {
	CONNECTOR,
	OWNER,
	TARGET
}

export enum EntityIdsEnum {
	OWNER = '73019816-b4f7-4b9a-b967-e2fb6cbf20ff',
	CONNECTOR = 'ca3aa917-f4b5-4579-801e-70f8c5ded1d6',
	TARGET = '014b7dfc-75be-44b4-91e4-6784f388dc5d'
}

export enum InteractionMenuOptionsEnum {
	QUESTION,
	MESSAGE,
	CALENDAR
}

export enum ConnectionStatusEnum {
	APPROVED,
	PENDING_APPROVAL,
	DECLINED
}

export enum IntroStatusEnum {
	INTRO,
	GOOD_TO_GO,
	DONE_DEAL
}

// Todo All - use i18n
export enum OpportunityCategoriesEnum {
	OPP_TYPE = 'Opp type',
	LOCATION = 'Location',
	TEAM_SIZE = 'Team Size',
	TITLE = 'Title',
	TYPE_OF_BUSINESS = 'Type of business',
	VERTICAL = 'Vertical',
	SERVICE_PROVIDER = 'Service Provider',
	BUDGET = 'Budget'
}

export enum ProfileItemCategoriesEnum {
	PERSONAL_INFO = 'Personal Info',
	SOCIAL_NETWORKS = 'Social Networks',
	WORK_EXPERIENCE = 'Work Experience',
	ABOUT_ME = 'About Me'
}

export enum OpportunityTypesTextEnum {
	'a9c6935d-3608-4b80-80a8-50d8221daae7' = 'Hiring',
	'a9c6935d-3608-4b80-80a8-50d8221daae8' = 'Fundraising',
	'a9c6935d-3608-4b80-80a8-50d8221daae9' = 'Service Provider',
	'a9c6935d-3608-4b80-80a8-50d8221daaf0' = 'Business Development'
}

export enum ProccessTypeEnum {
	CREATING_NEW_OPP = 'CREATING_NEW_OPP',
	ADDING_NEW_CONNECTOR = 'ADDING_NEW_CONNECTOR'
}

export enum AttachmentTypesEnum {
	FILE = 'File',
	PHONE_NUMBER = 'Phone Number',
	LOCATION = 'Location',
	LINK = 'Link'
}

export enum StackItemTypeEnum {
	OPP_DETAILS = 'Opp details',
	INTRO_MESSAGE = 'Intro message',
	ATTACHMENTS = 'Attachments'
}

export enum ErrorTypesEnum {
	RECORDING_PERMISSION_DENIED = 'RECORDING_PERMISSION_DENIED'
}

export enum TemplatesEnum {
	VERTICAL_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	BUSINESS_TYPE_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae6',
	SERVICE_PROVIDER_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae8',
	BUDGET_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae9',
	OPP_TEMPLATE_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae6',
	INTRO_TEMPLATE_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	INTERACTION_TEMPLATE_ID = '538d79ed-f07c-449b-b979-894f6a91ff39',
	OPP_INITIAL_STATUS_ID = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	SOUND_RECORDER = '17ee38cb-b606-42ef-aa41-5b0d45abe7a2',
	SENT_INVITE = '1d5d6f75-b011-47ac-b78d-e95fa399849d',
	SENT_INTRODUCTION = 'e5e6d5e9-67b0-4b1a-b431-61d25782e4b0'

}

export enum InteractionTemplateFieldsEnum {
	SOUND_RECORDER = '881c865e-b7dc-43fa-aaa0-4a9a5e49a2d0',
	INTRO_TEMPLATE = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	PREDEFINED_QUESTIONS_ID = '0e3dbdb8-916b-48c2-97ac-6e4f7c403546',
	INTERNTAL_MESSAGE = '658691a4-ff1c-4305-b0c2-6c7114f640c6',
	FILE_ATTACHMENT = 'f88702e4-fd01-4670-b324-615d8d1c0748',
	URL_ATTACHMENT = 'cfc6f253-8167-4b62-8da7-e9c2a53f2f61',
	SEND_MSG = '54451021-32ea-406c-bf81-bb7f245b5c70',
	FIRST_MSG = '32b0d378-580f-46ec-b2ab-5e8a0f2b927a'
}

export enum InteractionTypesEnum {
	PREDEFINED_MESSAGE = 'db65d2e7-9d40-4e2f-b33e-5b82d76361db',
	ASK_QUESTION_MESSAGE = '07f5d1af-de56-431a-95be-2dfb1bc75580',
	OPP_CREATION = '82158914-7c37-4bad-8f69-a41c9ba6d18b',
	INTRODUCTION = '2996845d-5474-4dbf-9658-8ad43658a2d8',
	VOICE_INTRODUCTION = '01c2386e-1eea-4297-b961-a55309724cda',
	INTERNAL = '473f5a49-cc23-43f5-b6e2-99467b66722e',
	INTERNAL_MESSAGE = 'f23aef38-c5f5-42cf-b50f-9c1a1923832e',
	OPEN_CALL = '2aa5e806-32a0-4407-8f1a-d5bc165b871d',
	OPEN_SMS = '55bab36b-b791-4e8e-9ca0-1572e2b9d47b',
	OPEN_EMAIL = 'd969fb19-b0d5-4aee-8ecd-34e23812c12f',
	OPEN_CALENDER = 'a597ccbd-1e12-4201-a837-5f2ca015c826',
	SEND_INVITE = 'ae7ed19a-5349-4469-a69a-0a486f3987fd',
	SEND_MESSAGE = '07f5d1af-de56-431a-95be-2dfb1bc75580', // sent message
	GOOD_TO_GO = 'a532623a-445a-4e0d-99ad-776216703f0e', // we are good to go
	DELETED_OPP = 'e61be637-2b61-40c3-bade-7767a29f6205', // deleted opp
	DONE_DEAL = 'be92571f-d504-4ffb-81c1-806be84fb804', // done deal
	REJECTED_INVITE = 'ffb11f7f-6ef0-4335-b639-a35ac691aaff', // rejected invite
	CONFIRMED_INVITE = '2edd14bc-9b28-44f2-bcd6-a67f59091349', // confirmed invite
	OPP_CREATED = '82158914-7c37-4bad-8f69-a41c9ba6d18b', // opp created
	BACK_STEP = 'fba6cf54-89dd-493f-a7ee-c36da18e758e', // back step
	FIRST_MESSAGE = 'a9c6935d-3608-4b80-80a8-50d8221daae6',
	CONNECT_TO_TARGET = '70559715-7075-47f8-bb84-dbbbe8812f15', // connect to target
	ON_HOLD = 'bf196a74-cf1c-4e1e-b52d-eeb0d4764aa5' // on hold(pill card)
}

export enum IntSubResponseTypesEnum {
	YES_NO = '08e7cfb0-9563-4696-8fcd-1030384c0d1e'
}

export enum InteractionStatuses {
	SEND_MESSAGE = '0e966ec2-efc3-4908-8ce5-d0e198c740cb',
	GOT_MESSAGE = 'f5382361-0992-41aa-a808-fc95d1e4fee8',
	SEEN_OPP_ID = 'e8e394df-98f4-40a1-b270-877bd09e2101', // this is the InteractionStatusId means the user SAW this opp
	INTERACTION_INITIAL_STATUS_ID = '0e966ec2-efc3-4908-8ce5-d0e198c740cb' // This is the NOT seen opp (New opp for connector/target)
}

export enum TargetStatusesEnum {
	PENDING = '01630fd3-d0e6-446c-91b8-c4683fcfa992',
	INTRO = 'fdd3effc-31db-4c11-bfe8-33106f20cf78',
	WE_ARE_GOOD_TO_GO = '538f2c3c-6280-4a53-9898-d5ba90af922f',
	DONE_DEAL = '0ed1ec3d-f905-43b4-9432-ea337aa5e3d0',
	DELETE_AND_FORGOT = 'e60e93de-27ce-40d1-b6d2-ddc796ef8bf4',
	MY_PART_IS_DONE = '9f4ae746-1717-4711-ba19-846840b1bed8'
}

export enum OpportunityStatusesEnum {
	OPEN = 'a9c6935d-3608-4b80-80a8-50d8221daae6',
	START = 'f04086bd-01f8-465b-9b66-b5619b7fda9f',
	IN_PROGRESS = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	COMPLETE = '47e3fe29-88f3-4c42-943d-03d2be045a0b',
	ON_HOLD = 'a9c6935d-3608-4b80-80a8-50d8221daae8'
}

export enum OpportunityConnectorStatusesEnum {
	PENDING_APPROVAL = '266df107-6c5b-4ea2-bb84-1578c702fc90',
	DECLINED = '994c391a-b9d7-45f2-a342-27df069cdc25',
	APPROVED = '6efacda2-6da0-463c-b31f-d5dab1d60806'
}

export enum OppActionEnum {
	CONNECTED,
	CREATED
}

export enum SpacielInteractionsTypeEnum {
	SMS,
	EMAIL,
	CALL
}

export enum OpportunityTypesEnum {
	HIRING = 'a9c6935d-3608-4b80-80a8-50d8221daae7',
	FUNDRAISING = 'a9c6935d-3608-4b80-80a8-50d8221daae8',
	SERVICE_PROVIDER = 'a9c6935d-3608-4b80-80a8-50d8221daae9',
	BUSINESS_DEVELOPMENT = 'a9c6935d-3608-4b80-80a8-50d8221daaf0'
}
