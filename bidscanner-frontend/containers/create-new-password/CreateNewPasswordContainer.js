// @flow
import CreateNewPassword from 'components/create-new-password/CreateNewPassword';

import { compose } from 'react-apollo';
import { withCookies } from 'react-cookie';

export default compose(withCookies)(CreateNewPassword);
