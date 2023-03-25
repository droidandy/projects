import { reduxForm } from 'redux-form';
import Search from 'components/general/Search';
import { compose } from 'react-apollo';

const initialValuesFromQuery = query => {
  let initialValues = {};
  if (query.string) {
    initialValues = { ...initialValues, search: query.string };
  }
  if (query.filter) {
    initialValues = {
      ...initialValues,
      filter: query.filter,
    };
  }
  return initialValues;
};

export default compose(
  Form => ({ query, ...otherProps }) =>
    query ? <Form initialValues={initialValuesFromQuery(query)} {...otherProps} /> : <Form />,
  reduxForm({
    form: 'search',
  })
)(Search);
