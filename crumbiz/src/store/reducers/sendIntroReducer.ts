import { SendIntroTypes } from '../constants';
import {
	IReduxAction,
	IEntityData,
	IOpportunitySummary,
	IIntroMessage
} from '../../types/interfaces';
import { AttachmentTypesEnum } from '../../types/enums';
import { IAttachment, IOpportunity } from '../../types/interfaces';

export interface ISendIntroInitialState {
	attachments: { [key in AttachmentTypesEnum]?: IAttachment };
	recordingFilePath: string;
	recordingBase64: string;
	introMessage: IIntroMessage;
	oppData: Partial<IOpportunity>;
	chosenOppId: string;
	oppSummary: IOpportunitySummary | null;
	templates: Array<{}>;
	isOppsArrived: boolean;
}

const initialState: ISendIntroInitialState = {
	attachments: {},
	recordingFilePath: '',
	recordingBase64: '',
	introMessage: { id: null },
	oppData: {},
	chosenOppId: '',
	templates: [],
	isOppsArrived: false,
	oppSummary: null
};

const sendIntroReducer = (
	state = initialState,
	action: IReduxAction<SendIntroTypes>
) => {
	switch (action.type) {
		case SendIntroTypes.UPDATE_INTRO:
			return {
				...state,
				[action.payload.key]: action.payload.value
			};

		case SendIntroTypes.ADD_ATTACHMENT:
			return {
				...state,
				attachments: {
					...state.attachments,
					[action.payload.key]: action.payload.value
				}
			};

		case SendIntroTypes.REMOVE_ATTACHMENT:
			const { key } = action.payload;
			// @ts-ignore
			const { [key]: thingToRemove, ...rest } = state.attachments;
			return {
				...state,
				attachments: {
					...rest
				}
			};

		case SendIntroTypes.RESET_INTRO_STATE:
			return {
				...initialState
			};

		case SendIntroTypes.SET_OPP_DATA:
			return {
				...state,
				oppData: action.payload,
				isOppsArrived: true
			};
		case SendIntroTypes.CHOOSE_OPP_ID:
			return {
				...state,
				chosenOppId: action.payload
			};
		case SendIntroTypes.SET_TEMPLATES:
			return {
				...state,
				templates: action.payload
			};
		case SendIntroTypes.ADD_SAVED_TEMPLATE:
			return {
				...state,
				templates: [...state.templates, action.payload]
			};

		default:
			return state;
	}
};

export default sendIntroReducer;
