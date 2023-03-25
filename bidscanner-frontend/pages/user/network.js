// @flow
import compose from 'recompose/compose';
import redirectIfNotLogged from 'containers/shared/redirectIfNotLogged';
import withData from 'lib/withData';

import MyLayout from 'components/MyLayout';
import MyNetwork from 'components/network/Network/index';

const MyNetworkPage = () =>
  <MyLayout title="My Network" active="network">
    <MyNetwork />
  </MyLayout>;

export default compose(withData, redirectIfNotLogged)(MyNetworkPage);
