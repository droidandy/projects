// @flow
import withData from 'lib/withData';

import MyLayout from 'components/MyLayout';
import Company from 'containers/company/CompanyContainer';

const company = {
  name: 'General Electric Incorporated',
};

const MyCompanyPage = () => (
  <MyLayout title="My Company" active="company">
    <Company company={company} />
  </MyLayout>
);

export default withData(MyCompanyPage);
