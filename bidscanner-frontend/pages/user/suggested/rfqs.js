// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import SuggestedRFQsContainer from 'containers/suggested-rfqs/SuggestedRFQsContainer';

export default compose(withData, redirectIfNotLogged)(SuggestedRFQsContainer);
