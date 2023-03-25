import RestApi from '../RestApi';
import { IUserAdditional } from '../../../types/interfaces';
import crumbizApi from '../crumbizInstance';

class UserAdditionalsEP extends RestApi<IUserAdditional> {
	routeName = 'userAdditionals';
}

const userAdditionalsEP = new UserAdditionalsEP();

export default userAdditionalsEP;
