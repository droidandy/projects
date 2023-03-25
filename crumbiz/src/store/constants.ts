//------------------------------------//
//  Auth                              //
//------------------------------------//
export enum AuthActionTypes {
	GET_USER_DETAILS = '@auth/GET_USER_DETAILS',
	SET_USER_DETAILS = '@auth/SET_USER_DETAILS',
	UPDATE_USER_DETAILS = '@auth/UPDATE_USER_DETAILS',
	CLEAR_USER_DETAILS = '@auth/CLEAR_USER_DETAILS',
	LOGOUT_USER = '@auth/LOGOUT_USER',
	LOGIN = '@auth/LOGIN',
	LOGIN_SUCCESS = '@auth/LOGIN_SUCCESS',
	REGISTER = '@auth/REGISTER',
	AUTH_SUCCESS = '@auth/AUTH_SUCCESS',
	REFRESH_TOKEN = '@auth/REFRESH_TOKEN',
	FORGOT_PASSWORD = '@auth/FORGOT_PASSWORD',
	FORGOT_PASSWORD_SENT = '@auth/FORGOT_PASSWORD_SENT',
	CHANGE_PASSWORD = '@auth/CHANGE_PASSWORD',
	RESET_PASSWORD = '@auth/RESET_PASSWORD',
	CONFIRM_REGISTERATION = '@auth/CONFIRM_REGISTERATION',
	INIT_AUTHENTICATION_FLOW = '@auth/INIT_AUTHENTICATION_FLOW'
}

//------------------------------------//
//  Create Opportunity                //
//------------------------------------//
export enum CreateOpportunityTypes {
	UPDATE_OPPORTUNITY = '@createOpportunity/UPDATE_OPPORTUNITY',
	SUBMIT_OPPORTUNITY = '@createOpportunity/SUBMIT_OPPORTUNITY',
	RESET_CREATE_OPP_STATE = '@createOpportunity/RESET_CREATE_OPP_STATE',
	SET_ADD_NEW_CONNECTOR_CONFIG = '@createOpportunity/SET_ADD_NEW_CONNECTOR_CONFIG',
	ADD_NEW_CONNECTOR = '@createOpportunity/ADD_NEW_CONNECTOR',
	GET_TEMPLATE_FIELD = '@createOpportunity/GET_TEMPLATE_FIELD',
	SET_TEMPLATE_FIELD = '@createOpportunity/SET_TEMPLATE_FIELD',
	GET_OPP_TYPES = '@createOpportunity/GET_OPP_TYPES',
	SET_OPP_TYPES = '@createOpportunity/SET_OPP_TYPES'
}

//------------------------------------//
//  Send Intro                        //
//------------------------------------//
export enum SendIntroTypes {
	UPDATE_INTRO = '@sendIntro/UPDATE_INTRO',
	ADD_ATTACHMENT = '@sendIntro/ADD_ATTACHMENT',
	REMOVE_ATTACHMENT = '@sendIntro/REMOVE_ATTACHMENT',
	RESET_INTRO_STATE = '@sendIntro/RESET_INTRO_STATE',
	// GET_OPPORTUNITYS_AS_CONNECTOR = '@sendIntro/GET_OPPORTUNITYS_AS_CONNECTOR',
	SET_OPP_DATA = '@sendIntro/SET_OPP_DATA',
	CHOOSE_OPP_ID = '@sendIntro/CHOOSE_OPP_ID',
	CHECK_FOR_ENTITY_EXISTENCE = '@sendIntro/CHECK_FOR_ENTITY_EXISTENCE',
	PREPARE_TEMPLATES = '@sendIntro/PREPARE_TEMPLATES',
	SET_TEMPLATES = '@sendIntro/SET_TEMPLATES',
	SAVE_NEW_TEMPLATE = '@sendIntro/SAVE_NEW_TEMPLATE',
	ADD_SAVED_TEMPLATE = '@sendIntro/ADD_SAVED_TEMPLATE',
	CONNECT_TARGET = '@sendIntro/CONNECT_TARGET',
	GET_OPP_DETAILS_AND_TEMPLATES = '@sendIntro/GET_OPP_DETAILS_AND_TEMPLATES'
}

//------------------------------------//
//  External Links                    //
//------------------------------------//
export enum ExternalLinksTypes {
	SET_REDIRECTED_FROM_EXTERNAL = '@sendIntro/SET_REDIRECTED_FROM_EXTERNAL'
}

//------------------------------------//
//  Opp OverView                      //
//------------------------------------//
export enum OppOverviewTypes {
	GET_ASSOCIATED_OPPS = '@oppOverview/GET_ASSOCIATED_OPPS',
	SET_ASSOCIATED_OPPS = '@oppOverview/SET_ASSOCIATED_OPPS',
	GET_TARGET_PROFILE = '@oppOverview/GET_TARGET_PROFILE',
	SET_OPP_ID_AND_ROLE = '@oppoverview/SET_OPP_ID_AND_ROLE',
	GET_OPP_SUMMARY = '@oppOverview/GET_OPP_SUMMARY',
	SET_OPP_SUMMARY = '@oppOverview/SET_OPP_SUMMARY',
	GET_OPP_DETAILS_TARGETS_AND_CONNECTORS = '@oppOverview/GET_OPP_DETAILS_TARGETS_AND_CONNECTORS',
	SET_TARGETS_AND_CONNECTORS = '@oppOverview/SET_TARGETS_AND_CONNECTORS',
	SET_OPP_DETAILS = '@oppoppOverview/SET_OPP_DETAILS',
	UPDATE_TARGET_STATUS = '@oppOverview/UPDATE_TARGET_STATUS', // UI Update
	CHANGE_TARGET_STATUS = '@oppOverview/CHANGE_TARGET_STATUS', // DB update
	RESET_OPP_OVERVIEW_STATE = '@oppOverview/RESET_OPP_OVERVIEW_STATE',
	CHANGE_ENTITY_DECISION = '@oppOverview/CHANGE_ENTITY_DECISION',
	UPDATE_TARGET_STATUS_INSIDE_PROFILE = '@oppOverview/UPDATE_TARGET_STATUS_INSIDE_PROFILE',
	OPEN_CAN_ADD_TARGETS_MODAL = '@oppOverview/OPEN_CAN_ADD_TARGETS_MODAL',
	CHANGE_OPP_STATUS = '@oppOverview/CHANGE_OPP_STATUS', // DB update
	UPDATE_OPP_STATUS = '@oppOverview/UPDATE_OPP_STATUS', // UI update
	GET_PREDEFINED_MESSAGES = '@oppOverview/GET_PREDEFINED_MESSAGES',
	SET_PREDEFINED_MESSAGES = '@oppOverview/SET_PREDEFINED_MESSAGES',
	SEND_INTERACTION = '@oppOverview/SEND_INTERACTION',
	GET_NEW_OPP_DATA = '@oppOverview/GET_NEW_OPP_DATA',
	SET_NEW_OPP_DATA = '@oppOverview/SET_NEW_OPP_DATA',
	CC_TO_CONNECTOR_TOGGLE = '@oppOverview/CC_TO_CONNECTOR_TOGGLE',
	SEND_SPACIEL_INTERACTION = '@oppOverview/SEND_SPACIEL_INTERACTION',
	SET_NEW_OPP_MODAL = '@oppOverview/SET_NEW_OPP_MODAL',
	GET_OPP_INTERACTIONS = '@oppOverview/GET_OPP_INTERACTIONS',
	GET_TARGET_INTERACTIONS = '@oppOverview/GET_TARGET_INTERACTIONS',
	GET_TARGET_OVERVIEW_INTERACTIONS = '@oppOverview/GET_TARGET_OVERVIEW_INTERACTIONS'
}

//------------------------------------//
//  Crumbiz Users                     //
//------------------------------------//
export enum CrumbizUsersTypes {
	GET_CRUMBIZ_USERS = '@crumbizUsers/GET_CRUMBIZ_USERS',
	SET_CRUMBIZ_USERS = '@crumbizUsers/SET_CRUMBIZ_USERS',
	GET_RELATIONSHIPS_DATA = '@crumbizUsers/GET_RELATIONSHIPS_DATA',
	SET_RELATIONSHIPS_DATA = '@crumbizUsers/SET_RELATIONSHIPS_DATA',
	UPDATE_USER_INFO = '@crumbizUsers/UPDATE_USER_INFO',
	UPDATE_USER_ADDITIONALS_INFO = '@crumbizUsers/UPDATE_USER_ADDITIONALS_INFO',
	RESET_CRUMBIZ_USERS_STATE = '@crumbizUsers/RESET_CRUMBIZ_USERS_STATE'
}
//------------------------------------//
//  InteractionsFeed types            //
//------------------------------------//
export enum InteractionsTypes {
	GET_SUMMARY_DATA = '@interactions/GET_SUMMARY_DATA',
	GET_INTERACTIONS = '@interactions/GET_INTERACTIONS'
}
//------------------------------------//
//  Depplink types                    //
//------------------------------------//
export enum DeepLinksTypes {
	SET_DEEP_LINK = '@deepLinks/SET_DEEP_LINK',
	CLEAR_DEEP_LINK = '@deepLinks/CLEAR_DEEP_LINK'
}

//------------------------------------//
//  My opps types                     //
//------------------------------------//
export enum MyOppsTypes {
	GET_MY_OPPS = '@myOpps/GET_MY_OPPS',
	SET_MY_OPPS = '@myOpps/SET_MY_OPPS',
	RESET_MY_OPPS_STATE = '@myOpps/RESET_MY_OPPS_STATE'
}

//------------------------------------//
// Entity types                       //
//------------------------------------//

export enum EntityTypes {
	INIT_ENTITY = '@entity/INIT_ENTITY',
	SET_ENTITY = '@entity/SET_ENTITY',
	TOGGLE_PHONE_PREFERENCE = '@entity/TOGGLE_PHONE_PREFERENCE',
	TOGGLE_EMAIL_PREFERENCE = '@entity/TOGGLE_EMAIL_PREFERENCE',
	CLEAR_ENTITY_STATE = '@entity/CLEAR_ENTITY_STATE',
	SET_ENTITY_EXISTS = '@entity/SET_ENTITY_EXISTS'
}
