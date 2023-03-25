import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import UserRFQs from 'components/rfqs/RFQs';

const selector = formValueSelector('rfqs');

export default connect((state, { url: { query: initialQuery } }) => {
  const query = selector(state, 'string', 'page');

  return {
    query,
    initialValues: {
      page: 1,
      ...initialQuery,
    },
  };
}, null)(
  reduxForm({
    form: 'rfqs',
  })(UserRFQs)
);
