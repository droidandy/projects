import * as Yup from 'yup';

const PersonGenderFieldsetSchema = Yup.object().shape({
  gender: Yup.string().required('Необходимо выбрать пол'),
});

export { PersonGenderFieldsetSchema };
