// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import UserProductsContainer from 'containers/products/ProductsContainer';

export default compose(withData, redirectIfNotLogged)(UserProductsContainer);
