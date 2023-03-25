import { reduxForm } from 'redux-form';

import DefaultHome from 'components/home/Home/DefaultHome';

export default reduxForm({
  form: 'search',
  initialValues: {
    entity: 'Products',
  },
})(DefaultHome);
