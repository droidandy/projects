interface ISingleTemplateField {
	id: string;
	title: string;
}

const parseAndReturnTitle = (lookupData: string, uniqeId: string) => {
	const parsedData = JSON.parse(lookupData);
	const foundTemplate = parsedData.find(
		(template: ISingleTemplateField) => template.id === uniqeId
	);
	if (foundTemplate) return foundTemplate.title;
	return '';
};

export default parseAndReturnTitle;
