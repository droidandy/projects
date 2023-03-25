import RestApi from '../RestApi';

interface IOppBusinessTypes {
	id: string;
	title: string;
	creatorUserId: string;
}

class OppBusinessTypesEP extends RestApi<IOppBusinessTypes> {
	routeName = 'OpportunityBusinessTypes';
}

const oppBusinessTypesEP = new OppBusinessTypesEP();

export default oppBusinessTypesEP;
