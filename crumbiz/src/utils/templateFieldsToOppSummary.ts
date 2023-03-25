import { ITemplateField, IOpportunitySummary } from '../types/interfaces';
import {
	TemplatesEnum,
	OpportunityCategoriesEnum,
	OpportunityTypesTextEnum
} from '../types/enums';
import convertBudgetNumberToString from './convertBudgetNumberToString';
import findValueInLookupData from './findValueInLookupData';

const templateFieldsToOppSummary = (
	TemplateFields: Array<any>,
	oppTypeId: string
): IOpportunitySummary => {
	const oppSummary: Partial<IOpportunitySummary> = {
		//@ts-ignore
		[OpportunityCategoriesEnum.OPP_TYPE]: OpportunityTypesTextEnum[oppTypeId]
	};

	TemplateFields.forEach((templateFieldData: ITemplateField) => {
		const lookupData = templateFieldData.templateField.lookupData;
		const uniqueId = templateFieldData.uniqValue;
		const floatValue = templateFieldData.floatValue;
		if (uniqueId || floatValue) {
			switch (templateFieldData.templateFieldId) {
				case TemplatesEnum.BUDGET_ID:
					const budget = floatValue;
					oppSummary[
						OpportunityCategoriesEnum.BUDGET
					] = convertBudgetNumberToString(budget, 1);
					break;

				case TemplatesEnum.BUSINESS_TYPE_ID:
					const businessTypetitle = findValueInLookupData(lookupData, uniqueId);
					oppSummary[
						OpportunityCategoriesEnum.TYPE_OF_BUSINESS
					] = businessTypetitle;
					break;

				case TemplatesEnum.SERVICE_PROVIDER_ID:
					const servierProviderTitle = findValueInLookupData(
						lookupData,
						uniqueId
					);
					oppSummary[
						OpportunityCategoriesEnum.SERVICE_PROVIDER
					] = servierProviderTitle;
					break;

				case TemplatesEnum.VERTICAL_ID:
					const verticalTitle = findValueInLookupData(lookupData, uniqueId);

					oppSummary[OpportunityCategoriesEnum.VERTICAL] = {
						...oppSummary[OpportunityCategoriesEnum.VERTICAL],
						[verticalTitle]: uniqueId
					};
					break;
			}
		}
	});
	//@ts-ignore
	return oppSummary;
};

export default templateFieldsToOppSummary;
