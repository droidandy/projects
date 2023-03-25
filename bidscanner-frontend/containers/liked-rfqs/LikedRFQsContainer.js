import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import LikedRFQs from 'components/liked-rfqs/LikedRFQs';

const selector = formValueSelector('liked-rfqs');

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
    form: 'liked-rfqs',
  })(LikedRFQs)
);
