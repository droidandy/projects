import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import SuggestedRFQs from 'components/suggested-rfqs/SuggestedRFQs';

const selector = formValueSelector('suggested-rfqs');

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
    form: 'suggested-rfqs',
  })(SuggestedRFQs)
);
