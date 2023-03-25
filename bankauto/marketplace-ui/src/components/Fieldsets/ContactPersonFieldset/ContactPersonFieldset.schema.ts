import * as Yup from 'yup';
import { withoutCode } from 'helpers';

const ContactPersonFieldsetSchema = (userPhone?: string) =>
  Yup.object().shape({
    contactPersonsLastName: Yup.string()
      .required('Необходимо указать фамилию')
      .min(2, 'Минимальное количество символов: 2')
      .max(133, 'Максимальное количество символов: 133')
      .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Допустимые символы: А-я, -, *'),
    contactPersonsFirstName: Yup.string()
      .required('Необходимо указать имя')
      .min(2, 'Минимальное количество символов: 2')
      .max(133, 'Максимальное количество символов: 133')
      .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Допустимые символы: А-я, -, *'),
    contactPersonsPatronymic: Yup.string()
      .required('Необходимо указать отчество')
      .min(2, 'Минимальное количество символов: 2')
      .max(133, 'Максимальное количество символов: 133')
      .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Допустимые символы: А-я, -, *'),
    contactPersonsType: Yup.string().nullable().required('Необходимо указать кем приходится'),
    contactPersonsPhone: Yup.string()
      .required('Необходимо указать телефон')
      .length(10, 'Телефон состоит из 10 цифр')
      .test('similarNumbers', 'Совпадает с телефоном заемщика', function (value) {
        if (!userPhone) {
          return true;
        }
        return withoutCode(userPhone) !== value;
      }),
  });

export { ContactPersonFieldsetSchema };
