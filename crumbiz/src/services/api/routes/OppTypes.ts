import RestApi from '../RestApi';

interface IOpportunityTypes {}

class OppTypesEP extends RestApi<IOpportunityTypes> {
	routeName = 'OpportunityTypes';
}

const oppTypesEP = new OppTypesEP();

export default oppTypesEP;
