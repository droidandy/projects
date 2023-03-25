// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import UserRFQsContainer from 'containers/rfqs/RFQsContainer';

export default compose(withData, redirectIfNotLogged)(UserRFQsContainer);
