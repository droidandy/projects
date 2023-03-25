// @flow
import RequestNewPassword from 'components/request-new-password/RequestNewPassword';

import { compose } from 'react-apollo';
import { withCookies } from 'react-cookie';

export default compose(withCookies)(RequestNewPassword);
