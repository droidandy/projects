import { reduxForm, formValueSelector } from 'redux-form';

import Form from 'components/new-rfq/GenerateRFQ/Form';
import { connect } from 'react-redux';
// import validate from 'components/new-rfq/reviewRFQ/validatePromotion';

const form = 'generateRFQForm';

const GenerateFormContainer = reduxForm({
  form,
  initialValues: {
    title: '',
    description: '',
    files2: [
      { id: '1', name: 'very-very-very-long-name-of-file-that-was-uploaded1.png', completed: true },
      {
        id: '2',
        name: 'very-very-very-long-name-of-file-that-was-uploaded2.png',
        completed: false,
        progress: 0.5,
      },
      {
        id: '3',
        name: 'very-very-very-long-name-of-file-that-was-uploaded3.png',
        completed: false,
        progress: -1,
      },
      { id: '1', name: 'file1.png', completed: true },
      { id: '2', name: 'file2.png', completed: false, progress: 0.5 },
      { id: '3', name: 'file3.png', completed: false, progress: -1 },
    ],
    files: [],
    subcategories: [],
  },
})(Form);

const selector = formValueSelector(form);

export default connect(state => ({
  closingDate: selector(state, 'closingDate'),
}))(GenerateFormContainer);
