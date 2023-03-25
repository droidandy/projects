import { combineReducers } from 'redux';
import createOpportunityReducer from './createOpportunityReducer';
import authReducer from './authReducer';
import sendIntroReducer from './sendIntroReducer';
import externalLinkReducer from './externalLinksReducer';
import oppOverviewReducer from './oppOverViewReducer';
import crumbizUsersReducer from './crumbizUsersReducer';
import summaryReducer from './summaryReducer';
import interactionsReducer from './interactionsReducer';
import deepLinksReducer from './deepLinksReducer';
import myOppsReducer from './myOppsReducer';
import pendingReducer from './pendingReducer';
import entityReducer from './entityReducer.ts';

export default combineReducers({
	pending: pendingReducer,
	interactions: interactionsReducer,
	summary: summaryReducer,
	createOpportunity: createOpportunityReducer,
	sendIntro: sendIntroReducer,
	auth: authReducer,
	externalLinks: externalLinkReducer,
	oppOverview: oppOverviewReducer,
	crumbizUsers: crumbizUsersReducer,
	deepLinks: deepLinksReducer,
	myOpps: myOppsReducer,
	entity: entityReducer
});
