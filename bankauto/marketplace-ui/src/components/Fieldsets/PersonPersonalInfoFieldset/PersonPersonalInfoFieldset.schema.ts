import * as Yup from 'yup';

// eslint-disable-next-line no-misleading-character-class, no-useless-escape
const NAME_REGEXP = /^[а-яА-ЯёЁ]+([\-\s][а-яА-ЯёЁ]+)*$/;
// Первый шаг БП требует номера с +79 в начале
const PHONE_REGEXP = /^9[0-9]{9}/;

const PersonPersonalInfoFieldsetSchema = (validatePhone: boolean = false, emailRequired: boolean = false) =>
  Yup.object().shape({
    lastName: Yup.string()
      .required('Необходимо указать фамилию')
      .min(2, 'Минимальное количество символов: 2')
      .matches(NAME_REGEXP, 'Допустимые символы: А-я, -')
      .max(30, 'Максимальное количество символов: 30'),
    firstName: Yup.string()
      .required('Необходимо указать имя')
      .min(2, 'Минимальное количество символов: 2')
      .matches(NAME_REGEXP, 'Допустимые символы: А-я, -')
      .max(30, 'Максимальное количество символов: 30'),
    patronymic: Yup.string()
      .required('Необходимо указать отчество')
      .min(2, 'Минимальное количество символов: 2')
      .matches(NAME_REGEXP, 'Допустимые символы: А-я, -')
      .max(30, 'Максимальное количество символов: 30'),
    email: emailRequired
      ? Yup.string().required('Необходимо указать email').email('Некорректный email')
      : Yup.string().nullable().email('Некорректный email'),
    phone: validatePhone
      ? Yup.string()
          .required('Необходимо указать телефон')
          .length(10, 'Некорректный телефон')
          .matches(PHONE_REGEXP, 'Формат телефона +7 (9##) ###-##-##')
      : Yup.string().notRequired(),
  });

export { PersonPersonalInfoFieldsetSchema };
