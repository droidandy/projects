// @flow
import { compose } from 'react-apollo';
import withData from 'lib/withData';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';

import LikedProductsContainer from 'containers/liked-products/LikedProductsContainer';

export default compose(withData, redirectIfNotLogged)(LikedProductsContainer);
