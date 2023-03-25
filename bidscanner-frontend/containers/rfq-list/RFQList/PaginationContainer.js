import { reduxForm } from 'redux-form';

import Pagination from 'components/rfq-list/RFQList/Pagination';
// import validate from 'components/createnewpassword/validate';

export default reduxForm({
  form: 'rfqListPagination',
})(Pagination);
