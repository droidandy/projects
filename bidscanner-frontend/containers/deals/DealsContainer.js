import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import UserDeals from 'components/deals/Deals';

const selector = formValueSelector('deals');

// { url: { query: initialQuery } }

export default connect((state, { url: { query: initialQuery } }) => {
  const query = selector(state, 'string', 'type', 'page', 'status', 'user');

  return {
    query,
    initialValues: {
      page: 1,
      type: 'All',
      ...initialQuery,
    },
  };
}, null)(
  reduxForm({
    form: 'deals',
  })(UserDeals)
);
