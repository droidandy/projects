import * as Yup from 'yup';
import { NAME_REGEXP } from 'constants/regexps';

const phoneValidation = () => Yup.string().length(12, 'Некорректный формат телефона');

export const ExpressFormSchema = Yup.object().shape({
  phone: phoneValidation().required('Необходимо указать телефон'),
  name: Yup.string()
    .required('Необходимо указать имя')
    .min(2, 'Минимальное количество символов: 2')
    .matches(NAME_REGEXP, 'Допустимые символы: А-я, -'),
});
