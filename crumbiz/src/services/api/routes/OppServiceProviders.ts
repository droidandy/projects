import RestApi from '../RestApi';
import crumbizApi from '../crumbizInstance';

interface IOppServiceProvider {
	id: string;
	title: string;
	creatorUserId: string;
	image: string;
	imageType: string;
}

class OppServiceProvidersEP extends RestApi<IOppServiceProvider> {
	routeName = 'OpportunityServiceProviders';
}

const oppServierProviders = new OppServiceProvidersEP();

export default oppServierProviders;
