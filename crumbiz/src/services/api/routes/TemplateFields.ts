import RestApi from '../RestApi';
import { TemplatesEnum } from '../../../types/enums';
import crumbizApi from '../crumbizInstance';

interface ITemplateFields {}

class TemplateFieldsEP extends RestApi<ITemplateFields> {
	routeName = 'TemplateFields';

	getOppTemplateFields = async (templateFieldId: TemplatesEnum) => {
		try {
			const response = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `id eq ${templateFieldId}`
				}
			});
			return response.data;
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const templateFieldsEP = new TemplateFieldsEP();

export default templateFieldsEP;
