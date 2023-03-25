import RestApi from '../RestApi';
import {
	TemplatesEnum,
	InteractionTemplateFieldsEnum
} from '../../../types/enums';
import { IPredefinedQuestion } from '../../../types/interfaces';
import crumbizApi from '../crumbizInstance';

interface ITemplate {
	id?: string;
	templateTypeId?: string;
	body?: string;
	creatorUserId?: string;
	timestamp?: Date;
	title?: string;
}

class TemplatesEP extends RestApi<ITemplate> {
	routeName = 'Templates';

	getIntroTemplateFields = async () => {
		try {
			const response = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `templateTypeId eq ${TemplatesEnum.INTRO_TEMPLATE_ID}`,
					$expand: `TemplateFields`
				}
			});
			return response.data.value;
		} catch (error) {
			console.log('Could not load intro Templates');
		}
	};

	getPredefinedQuestions = async (): Promise<Array<IPredefinedQuestion>> => {
		try {
			const response = await crumbizApi.get(`/${this.routeName}`, {
				params: {
					$filter: `templateTypeId eq ${InteractionTemplateFieldsEnum.PREDEFINED_QUESTIONS_ID}`
				}
			});
			return response.data.value;
		} catch (ex) {
			throw new Error(ex);
		}
	};
}

const templatesEP = new TemplatesEP();

export default templatesEP;
