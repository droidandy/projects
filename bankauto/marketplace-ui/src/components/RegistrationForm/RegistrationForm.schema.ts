import * as Yup from 'yup';
import { NAME_REGEXP } from 'constants/regexps';

const RegistrationFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Необходимо указать имя')
    .min(2, 'Минимальное количество символов: 2')
    .max(20, 'Максимальное количество символов: 20')
    .matches(NAME_REGEXP, 'Допустимые символы: А-я, -'),
  email: Yup.string().email('Некорректный email'),
  acceptTerms: Yup.bool().oneOf([true], 'Нужно подтвердить свое согласие'),
});

export { RegistrationFormSchema };
