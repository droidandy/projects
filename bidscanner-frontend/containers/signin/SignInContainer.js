// @flow
import SignIn from 'components/signin/SignIn';

import { compose } from 'react-apollo';
import { withCookies } from 'react-cookie';

export default compose(withCookies)(SignIn);
