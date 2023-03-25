import { reduxForm } from 'redux-form';

import Pagination from 'components/item-list/ItemList/Pagination';
// import validate from 'components/createnewpassword/validate';

export default reduxForm({
  form: 'itemListPagination',
})(Pagination);
