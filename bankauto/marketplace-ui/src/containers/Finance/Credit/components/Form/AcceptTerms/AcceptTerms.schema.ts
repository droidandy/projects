import * as Yup from 'yup';

const AcceptTermsSchema = Yup.object().shape({
  acceptTerms: Yup.bool().required('Нужно принять условия').oneOf([true], 'Нужно принять условия'),
});

export { AcceptTermsSchema };
