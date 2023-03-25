import RestApi from '../RestApi';
import crumbizApi from '../crumbizInstance';

interface IOppTemplateFields {
	oppId: string;
}

class OppTemplateFieldsEP extends RestApi<IOppTemplateFields> {
	routeName = 'OpportunityTemplateFields';

	getOppTemplateFields = async (oppId: string) => {
		try {
			const res = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `opportunityTemplate/opportunityid eq ${oppId}`,
					$expand: `TemplateField`
				}
			});
			return res.data.value;
		} catch (ex) {
			console.log('Failed getOppTemplateFields', ex);
		}
	};
}

const oppTemplateFieldsEP = new OppTemplateFieldsEP();

export default oppTemplateFieldsEP;
