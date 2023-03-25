// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import MatchingSuppliers from 'containers/matching-suppliers/MatchingSuppliersContainer';

export default compose(withData, redirectIfNotLogged)(MatchingSuppliers);
