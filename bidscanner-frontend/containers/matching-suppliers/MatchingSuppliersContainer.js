import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import MatchingSuppliers from 'components/matching-suppliers/MatchingSuppliers';

const selector = formValueSelector('matching-suppliers');

export default connect((state, { url: { query: initialQuery } }) => {
  const query = selector(
    state,
    'string',
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
    initialValues: {
      page: 1,
      'sort-by': 'Relevance',
      ...initialQuery,
    },
  };
}, null)(
  reduxForm({
    form: 'matching-suppliers',
  })(MatchingSuppliers)
);
