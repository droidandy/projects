import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import LikedProducts from 'components/liked-products/LikedProducts';

const selector = formValueSelector('liked-products');

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
    form: 'liked-products',
  })(LikedProducts)
);
