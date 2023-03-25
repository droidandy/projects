import { IUserData, IOppInfo } from '../types/interfaces';
import _get from 'lodash/get';

interface ITemplateField {
	lookupData: string;
	id: string;
}

interface ITemplate {
	body: string;
	templateFields: Array<ITemplateField>;
	title: string;
	id: string;
}

interface IReadyTemplate {
	body: string;
	title: string;
	id: string;
}

export interface IOppEntities {
	opportunityTargets: {
		user: IUserData;
	};
	opportunityConnectors: {
		user: IUserData;
		user1: IUserData;
	};
	opportunities: IOppInfo;
}

const camelCase = (string: string) => {
	const splittedString = string.split('.');
	return splittedString
		.map(string => string.substr(0, 1).toLocaleLowerCase() + string.substr(1))
		.join('.');
};

const replaceIdsToNames = (
	templateText: string,
	mappedFieldsObj: { [key: string]: string }
) => {
	let newTemplateText = templateText;
	Object.entries(mappedFieldsObj).forEach(([id, name]) => {
		newTemplateText = newTemplateText.replace(
			new RegExp(`{{${id}}}`, 'g'),
			`<span class="highlighted">${name}</span>`
		);
	});
	return newTemplateText;
};

const prepareTemplates = (
	templates: Array<ITemplate>,
	oppEntities: IOppEntities
) => {
	const readyTemplates: Array<IReadyTemplate> = [];

	templates.forEach(template => {
		if (template.title !== 'Sound Record') {
			const mapFieldsIdToNames: { [key: string]: string } = {};
			template.templateFields.forEach(templateField => {
				const parsedLookupData = JSON.parse(templateField.lookupData);
				if (parsedLookupData) {
					const fixedFieldName = camelCase(parsedLookupData[0].fieldName);

					const splittedPath = fixedFieldName.split('.');
					const fieldNameValue = _get(oppEntities, splittedPath);
					mapFieldsIdToNames[templateField.id] = fieldNameValue;
				}
			});
			readyTemplates.push({
				body: replaceIdsToNames(template.body, mapFieldsIdToNames),
				title: template.title,
				id: template.id
			});
		}
	});

	return readyTemplates;
};

export default prepareTemplates;
