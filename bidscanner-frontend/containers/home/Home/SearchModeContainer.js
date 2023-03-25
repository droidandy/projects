import { reduxForm } from 'redux-form';

import SearchMode from 'components/home/Home/SearchMode';
// import validate from 'components/createnewpassword/validate';

export default reduxForm({
  form: 'search',
  destroyOnUnmount: false,
})(SearchMode);
