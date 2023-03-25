import { connect } from 'react-redux';
import { reduxForm, formValueSelector } from 'redux-form';

import UserProducts from 'components/products/Products';

const selector = formValueSelector('products');

export default connect(state => {
  const query = selector(state, 'string', 'page');

  return {
    query,
    initialValues: {
      page: 1,
    },
  };
}, null)(
  reduxForm({
    form: 'products',
  })(UserProducts)
);
