// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import LikedRFQsContainer from 'containers/liked-rfqs/LikedRFQsContainer';

export default compose(withData, redirectIfNotLogged)(LikedRFQsContainer);
