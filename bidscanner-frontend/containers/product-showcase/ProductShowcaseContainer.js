// @flow
import { connect } from 'react-redux';
import { formValueSelector } from 'redux-form';
import ProductShowcase from 'components/product-showcase/ProductShowcase';

const selector = formValueSelector('search');

export default connect(state => {
  const query = selector(state, 'page');

  return {
    query,
  };
}, null)(ProductShowcase);
