import { getUserDataSelector } from './authSelector';

export const sendIntroSelector = (state: any) => state.sendIntro;
export const selectTemplates = (state: any) =>
	sendIntroSelector(state).templates;
export const sendIntroAttachmentsSelector = (state: any) =>
	sendIntroSelector(state).attachments;
export const sendIntroFileSelector = (state: any) =>
	sendIntroSelector(state).recordingFilePath;
export const sendIntroRecordingBase64Selector = (state: any) =>
	sendIntroSelector(state).recordingFilePath;

export const getOppEntities = (state: any) => {
	const sentIntroData = sendIntroSelector(state);
	const connectorData = getUserDataSelector(state);

	const { oppData } = sentIntroData;
	const entity = state.entity.entity;
	// This object must stay in this form because of the fieldName returning from the Templates.
	return {
		opportunityTargets: {
			user: entity
		},
		opportunityConnectors: {
			// user = Owner,  user1 = Connector
			user: oppData.user,
			user1: connectorData
		},
		opportunities: oppData.opportunity
	};
};
