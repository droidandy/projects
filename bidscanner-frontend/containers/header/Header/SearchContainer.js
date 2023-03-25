import { reduxForm, formValueSelector } from 'redux-form';
import { compose } from 'react-apollo';
import { connect } from 'react-redux';

import Search from 'components/header/Header/Search';

const form = 'header-search';
const selector = formValueSelector(form);

export default compose(
  connect(state => {
    const query = selector(state, 'string', 'entity');

    return {
      query,
    };
  }, null),
  reduxForm({
    form,
    initialValues: {
      entity: 'Products',
    },
  })
)(Search);
