import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import Search from 'components/search/Search';

const selector = formValueSelector('search');

export default connect((state, { url: { query: initialQuery } }) => {
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
    initialValues: {
      entity: 'Products',
      page: 1,
      'sort-by': 'Relevance',
      ...initialQuery,
    },
  };
}, null)(
  reduxForm({
    form: 'search',
  })(Search)
);
