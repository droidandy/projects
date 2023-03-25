// @flow
import CompleteAccount from 'components/complete-account/CompleteAccount';

import { compose } from 'react-apollo';
import { withCookies } from 'react-cookie';

export default compose(withCookies)(CompleteAccount);
