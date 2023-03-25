// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import SuggestedProductsContainer from 'containers/suggested-products/SuggestedProductsContainer';

export default compose(withData, redirectIfNotLogged)(SuggestedProductsContainer);
