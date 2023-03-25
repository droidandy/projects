// @flow
import withData from 'lib/withData';

import MyLayout from 'components/MyLayout';
import AccountContainer from 'containers/account/AccountContainer';

const user = {
  name: 'Mark Foster',
  companies: [
    { id: '1', name: 'General Goods corp.', approved: false },
    { id: '2', name: 'General Motors, INC', approved: true },
  ],
};

const companies = [
  { id: '1', name: 'General Goods corp.', user },
  { id: '2', name: 'General Motors, INC', user },
  { id: '3', name: 'General Metallic Association Company', user },
  { id: '4', name: 'Generalized Company Of Tarade And Sell of Industrial Metalwings', user },
];

const MyCompanyPage = () => (
  <MyLayout title="My Account" active="account">
    <AccountContainer user={user} companies={companies} />
  </MyLayout>
);

export default withData(MyCompanyPage);
