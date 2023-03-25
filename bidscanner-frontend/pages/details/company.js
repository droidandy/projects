// @flow
import withData from 'lib/withData';
import CompanyDetails from 'components/company-details/CompanyDetails';
import data from 'components/company-details/sample-data/for-company-details';

const Page = () =>
  <div>
    <CompanyDetails {...data} />
  </div>;

export default withData(Page);
