import { reduxForm } from 'redux-form';

import Search from 'components/item-list/ItemList/Search';
// import validate from 'components/createnewpassword/validate';

export default reduxForm({
  form: 'itemListSearch',
})(Search);
