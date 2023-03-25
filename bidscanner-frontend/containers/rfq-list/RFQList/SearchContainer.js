import { reduxForm } from 'redux-form';

import Search from 'components/rfq-list/RFQList/Search';
// import validate from 'components/createnewpassword/validate';

export default reduxForm({
  form: 'rfqListSearch',
})(Search);
