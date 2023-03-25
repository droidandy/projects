// @flow
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import Landing from 'components/landing/Landing';

const selector = formValueSelector('search');

export default connect(state => {
  const query = selector(
    state,
    'string',
    'entity',
    'subcategory',
    'company',
    'country',
    'company-type',
    'certification',
    'distance',
    'sort-by',
    'page'
  );

  return {
    query,
  };
}, null)(Landing);
