import { NavigationScreenProp } from 'react-navigation';
import { DefaultTheme } from 'styled-components';
import React from 'react';

import {
	OpportunityCategoriesEnum,
	OpportunityStatusesEnum,
	TargetStatusesEnum,
	OpportunityConnectorStatusesEnum,
	EntityEnum,
	InteractionTypesEnum,
	AttachmentTypesEnum,
	OpportunityTypesEnum
} from './enums';
import { Action } from 'redux';
import { IDeepLinksReducerState } from '../store/reducers/deepLinksReducer';
import { TemplatesEnum } from './enums';
import { CalendarEventReadable } from 'react-native-calendar-events';

export type PlainFunction<T = any> = (params?: T) => any;

export type StateUpdaterFunction<T> = React.Dispatch<React.SetStateAction<T>>;

export type DynamicObject<T> = { [key: string]: T };

export type DelegatedRef<T> = React.RefObject<T>;

export type ModalAndSlidingDropdownRef = DelegatedRef<
	IModalAndSlidingDropdownControls
>;

export interface ODataResponse<T> {
	'@odata.context': string;
	value: Array<T>;
}

export interface IStackNavigation {
	navigation: NavigationScreenProp<any, any>;
}

export interface ITheme {
	theme: DefaultTheme;
}

export interface IPlainObject {
	[key: string]: any;
}

export interface IStyle {
	style?: DynamicObject<any> | Array<DynamicObject<any>>;
}

export interface IChildren {
	children?: React.ReactNode;
}

export interface IFunctionChildren<T> {
	children(params: T): React.ReactNode;
}

export interface IModalAndSlidingDropdownControls {
	open: PlainFunction;
	close: PlainFunction;
}

export interface IRegisterPayload {
	id: string;
	firstName: string;
	lastName: string;
	prefix: string;
	timestamp: string;
	authId: string;
	phone: string;
	email: string;
	avatar: string;
}

export interface IIsUserInOppParams {
	entityId: string;
	oppId: string;
}

export interface IAction<T, P> extends Action<T> {
	payload: P;
}

// TODO Yaron - Make specific for each reducer
export interface IReduxAction<T> {
	type: T;
	payload: any;
}

export interface IPayload<T> {
	payload: T;
}

export interface ITouchableProps {
	touchable?: boolean;
	onPress?: PlainFunction;
}

export interface IStoreProps {
	auth: {
		userAuthenticated: boolean;
		userData: IUserData;
		restorePassStepper: number;
	};
	deepLinks: IDeepLinksReducerState;
}

export interface IEntityData {
	firstName?: string;
	lastName?: string;
	email: Array<{ email: string }>;
	phone: Array<{ phone: string }>;
	entityId?: string;
	id?: string;
	text?: string;
}

export interface IChosenContactDetails extends IEntityData {}

export interface IUserData {
	id: string | null;
	firstName: string;
	lastName: string;
	prefix?: string;
	timestamp?: Date;
	authId?: string;
	phone?: string;
	email?: string;
	phones?: Array<{}>;
	userPhones?: Array<IUserPhone>;
	userEmails?: Array<IUserEmail>;
	[key: string]: any;
	userAdditionals?: Array<IUserAdditional>;
}

export interface IUserPhone {
	id?: string | null;
	userId?: string;
	phone: string;
	phoneTypeId: string | null;
	asDefault: boolean | null;
	userPhonePreferences: IUserPhonePreferences[];
}

export interface IUserPhonePreferences {
	id?: string | null;
	userPhoneId: string | null;
	creatorUserId: string;
	prefer: boolean;
}

export interface IUserEmail {
	id?: string | null;
	userId?: string;
	email: string;
	asDefault: boolean | null;
	userEmailPreferences: Array<IUserEmailPreferences>;
}

export interface IUserEmailPreferences {
	id?: string | null;
	userEmailId?: string;
	creatorUserId: string;
	prefer: boolean;
}
export interface IUserAdditional {
	id: string;
	userId: string;
	avatar: string;
	avatarType: string;
	userGenderId: string;
	birthday: string;
	countryId: string;
	stateId: string;
	cityId: string;
	country: string;
	countryName: string;
	score: number;
	linkedIn: string;
	facebook: string;
	twitter: string;
	about: string;
	introduction: string;
}

type EntitySource = 'contacts' | 'crumbiz' | 'linkedin';
export interface IEntity extends IUserData {
	source: EntitySource;
	key: string;
	text: string;
}

export interface IupdateUserInfoPayload {
	updatedUserObject: Partial<IUserData>;
}

export interface IUpdateUserAdditionalsPayload {
	updatedUserAdditionalsKeys: Partial<IUserAdditional>;
}

export interface IOppInfo {
	id: string;
	title: string;
}

export type IOpportunityConnectors = DynamicObject<
	string | IUserData | Array<{}> | DynamicObject<any>
>;
export interface ITemplate {
	interactionTemplateFields?: any;
	title: string;
	body: string;
	id?: string;
}

export interface IOppTemplateField {
	id: string;
	title: string;
}

export interface IOppTemplateFieldPayload {
	key: TemplatesEnum;
	value: Array<IOppTemplateField>;
}

export interface ITemplateField {
	id: string;
	templateFieldId: string;
	uniqValue: string;
	floatValue: number;
	templateField: {
		lookupData: string;
	};
}

export interface IOppType {
	id: string;
	title: string;
	text?: string;
	description: string;
	image?: React.StatelessComponent;
	imageType: string;
	onPress?: PlainFunction;
}

export interface IOpportunitySummary {
	[OpportunityCategoriesEnum.VERTICAL]: {
		[key: string]: string;
	};
	[OpportunityCategoriesEnum.SERVICE_PROVIDER]: string;
	[OpportunityCategoriesEnum.TYPE_OF_BUSINESS]: string;
	[OpportunityCategoriesEnum.BUDGET]: string;
	[OpportunityCategoriesEnum.OPP_TYPE]: string;
}

export interface IUpdateTargetStatusPayload {
	targetId: string;
	newStatus: TargetStatusesEnum;
}

export interface IChangeEntityDecisionPayload {
	newStatus: OpportunityConnectorStatusesEnum | TargetStatusesEnum;
	callback: PlainFunction;
	role: EntityEnum;
	entityId: string;
}
export interface ISendInteractionPayload {
	body: string;
	isPredefinedMessage: boolean;
	predefinedMessageTemplateId: string;
	targetUserId?: string;
	targetId: string;
	connectorUserId?: string;
	connectorId: string;
	ownerUserId?: string;
	cb?: PlainFunction;
}

export interface ISetNewOppDataPayload {
	interactionMessage: ITemplate;
	oppAndUsersData: IOppDetailsAndUsers;
}

export interface IIntroMessage {
	body?: string;
	id: string | null;
}

export interface IStatus {
	color: string;
	id: string;
	title: string;
}
export interface IOpportunity {
	description: string | null;
	id: string;
	opportunityStatusId: OpportunityStatusesEnum;
	opportunityStatus: IStatus | null;
	opportunityTypeId: string;
	parentId: string | null;
	timestamp: string;
	title: string;
}
export interface IOpporunityConnectorEP {
	id: string;
	parrentOpportunityConnectorId?: any;
	opportunityId: string;
	ownerUserId: string;
	connectorUserId: string;
	opportunityStatusId: string;
	opportunity: IOpportunity;
	user1: IUserData;
	user: IUserData;
}

export interface IUserExistenceResponse {
	Email: string | null;
	Phone: string | null;
	Id: string;
	UserPhoneId: string | null;
	UserEmailId: string | null;
}

export interface IOppTarget {
	id: string;
	parentOpportunityTargetId: string | null;
	opportunityConnectorId: string;
}

export interface IAssociatedOpp {
	connectorUserId: string | null;
	id: string;
	opportunity: IOpportunity;
	opportunityConnectorStatus: string | null;
	opportunityId: string;
	opportunityStatusId: string | null;
	opportunityTargets: Array<IOppTarget>;
	ownerUserId: string;
	parrentOpportunityConnectorId: string | null;
}

export interface IOppConnector {
	id: string;
	//The DB have typo with parrent and not parent
	parrentOpportunityConnectorId: null;
	opportunityId: string;
	ownerUserId: string;
	connectorUserId: string;
	opportunityStatusId: OpportunityConnectorStatusesEnum;
}

export interface IOppConnectorsExpandedWithTargets extends IOppConnector {
	opportunityTargets: Array<IOppTarget>;
	user1: IUserData;
}

export interface IOppTarget {
	id: string;
	opportunityConnectorId: string;
	opportunityTargetStatus: IStatus;
	opportunityTargetStatusId: TargetStatusesEnum;
	parentOpportunityTargetId: null | string;
	targetUserId: string;
	user: IUserData;
}

export interface IOppTargetDetails {
	targetUserId: string;
	oppTargetId: string;
	oppTargetUsername: string;
	oppConnectorId: string;
	oppConnectorUsername: string;
	oppConnectorAvatar: string;
	oppConnectorAvatarType: string;
	statusId: TargetStatusesEnum;
	oppTargetAvatar: string;
	oppTargetAvatarType: string;
	oppConnectorUserId: string;
	oppTargetPhone: string;
	oppTargetEmail: string;
}

export interface IOppConnectorDetails {
	oppConnectorId: string;
	oppConnectorUserId: string;
	oppConnectorUsername: string;
	oppConnectorAvatar: string;
	oppConnectorAvatarType: string;
	connectorTargetsCount: number;
	oppConnectorStatus: OpportunityConnectorStatusesEnum;
}

export interface IFilteredUser {
	email: string;
	firstName: string;
	lastName: string;
	id: string;
	userPhones?: Array<{ phone: string }>;
	userAdditionals: Array<IUserAdditional>; // TODO Yaron - change the type when there is details
}

export interface ISingleOppInList {
	title: string;
	status: string;
	statusTitle: string;
	statusColor: string;
	id: string;
	entityId?: string; // Not user id, thats oppConnectorId or oppTargetId
}

export interface IOppDetails {
	title: string;
	status: OpportunityStatusesEnum;
	statusColor: string;
	statusTitle: string;
	entityId?: string;
	oppId: string;
	role: number;
}
export interface IOppFullDetails {
	oppId: string;
	opportunityTypeId: string;
	oppStatus: OpportunityStatusesEnum;
	oppTitle: string;
	creationTime: string;
	ownerUserName: string;
	ownerUserId: string;
}

export interface IAssociatedOppsSection {
	[key: string]: {
		sectionTitle: string;
		data: Array<ISingleOppInList>;
	};
}

export interface IPredefinedQuestion {
	id: string;
	templateTypeId: string;
	body: string;
	title: string;
}

export interface IResetPasswordPayload {
	email: string;
	code: string;
	password: string;
}

export interface IGetProfileDataPayload {
	role: number;
	oppId: string;
}

export interface IGetTargetsPayload {
	oppId: string;
	userId: string;
	role: number;
}

export interface IChangeTargetStatusPayload {
	newStatus: TargetStatusesEnum;
	targetId: string;
	cb?: PlainFunction;
}
export interface ISetTargetsAndConnectorsPayload {
	oppTargets: Array<IOppTargetDetails>;
	oppConnectors: Array<IOppConnectorDetails>;
}

export interface ISubcontentContext {
	isExpanded: boolean;
	toggleExpanded: StateUpdaterFunction<boolean>;
	scrollViewRef: React.Ref<React.ReactNode> | null;
	profile?: Partial<IOppTargetDetails>; // TODO - consider removing
}

export interface IInteractionsEP {
	id?: string;
	interactionParentId?: string;
	opportunityConnectorId: string;
	opportunityTargetId: string;
	timestamp: string | Date;
	fromUserId: string;
	interactionTypeId: string;
	interactionStatusId: string;
}

export interface IInteractionsEPWithTemplate extends IInteractionsEP {
	interactionTemplates: Array<ITemplate>;
}

export interface IOppDetailsAndUsers extends IOppConnector {
	user: IUserData; // the owner
	user1: IUserData; // the connector
	opportunity: IOpportunity;
	opportunityTargets: Array<IOppTarget>;
}

export interface ISpecialInteractionUtilPayload {
	fromUsername: string;
	toUsername: string;
	type: InteractionTypesEnum;
	calendarData: CalendarEventReadable;
}

export interface ISpecialInteractionPayload {
	type: InteractionTypesEnum;
	targetUsername: string;
	targetId?: string;
	connectorId?: string;
	calendarData?: CalendarEventReadable;
}

export interface ISummaryData {
	openOpps: number;
	intros: number;
	pendingIntros: number;
}

export interface IVInteraction {
	id: string;
	timestamp: string;
	title?: string;
	interactionTypeId: InteractionTypesEnum;
	subject?: string;
	opportunityId: string;
	body?: string;
	roleId?: string;
	role?: string;
	targetUser: string;
	ownerUser: string;
	connectorUser: string;
	ownerUserId: string;
	connectorUserId: string;
	targetUserId: string;
	fromUserId?: string | IUserData;
	toUserId?: string | IUserData;
}
export interface IFileAttachment {
	type: string;
	megaSize: number;
	name: string;
	uri: string;
}
export interface ILinkAttachment {
	link: string;
	linkName?: string;
}
export type IAttachmentContent = IFileAttachment | ILinkAttachment;

export interface IAttachment {
	title: string;
	content: IAttachmentContent;
}

export type IAttachmentsObj = Record<AttachmentTypesEnum, IAttachment>;

/// my-opps ////

export interface IGetMyOppsPayload {
	authId: string;
}
///////

export interface IUserExpandedWithRelationships {
	id: string;
	firstName: string;
	lastName: string;
	prefix?: any;
	timestamp: string;
	authId: string;
	email: string;
	userExternalProviderId?: any;
	externalProviderId?: any;
	syncDate?: any;
	disableNotification?: boolean;
	userAdditionals: [];
	'opportunityConnectors@odata.count': number;
	opportunityConnectors: IOpportunityConnector[];
	'opportunityTargets@odata.count': number;
	opportunityTargets: IOpportunityTarget[];
	userPhones: [{ phone: string }];
}

export interface IOpportunityTarget {
	id: string;
	opportunityTargetStatusId: string;
}

export interface IOpportunityConnector {
	id: string;
	opportunityStatusId: string;
}

export interface IUserAdditionalInfo {
	id: string;
	userId: string;
	userGenderId?: string;
	birthday?: string;
	avatar: string;
	avatarType: string;
	about?: string;
	introduction?: string;
	stateId?: string;
	country?: string;
	countryId?: string;
	cityId?: string;
	linkedIn?: string;
	facebook?: string;
	twitter?: string;
	score?: number;
}

//
export interface IOpp {
	id: string;
	title: string;
	timestamp: string;
	opportunityStatusId: OpportunityStatusesEnum;
	opportunityTypeId: OpportunityTypesEnum;
	opportunityConnectors: OpportunityConnector[];
}

interface OpportunityConnector {
	ownerUserId: string;
	connectorUserId: string;
	opportunityStatusId: OpportunityConnectorStatusesEnum;
	opportunityTargets: OpportunityTarget[];
}

interface OpportunityTarget {
	targetUserId: string;
	opportunityTargetStatusId: TargetStatusesEnum;
}

// export interface IFilteredOpp {
// 	id: string;
// 	title: string;
// 	timestamp: string;
// 	role: EntityEnum;
// 	opportunityTypeId: OpportunityTypesEnum;
// 	targetStatusId?: TargetStatusesEnum;
// 	connectorStatusId: OpportunityConnectorStatusesEnum;
// 	opportunityStatusId: OpportunityStatusesEnum;
// }
export interface IOppItem {
	id: string;
	title: string;
	timestamp: string;
	role: EntityEnum;
	opportunityTypeId: OpportunityTypesEnum;
	targetStatusId?: TargetStatusesEnum;
	connectorStatusId: OpportunityConnectorStatusesEnum;
	opportunityStatusId: OpportunityStatusesEnum;
}

export interface SagaRequestsState<T> {
	data: T;
	pending: number;
	error: any;
}

export interface ISwitcherProps {
	loading: boolean;
	LoadingComponent: React.FC<any>;
	WrappedComponent: React.FC<any>;
}
