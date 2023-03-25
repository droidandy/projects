import { NAME_REGEXP } from 'constants/regexps';
import * as Yup from 'yup';

const PHONE_REGEXP = /9[0-9]{9}/g;

const LeadFormSchema = Yup.object().shape({
  name: Yup.string()
    .required('Необходимо указать имя')
    .min(2, 'Минимальное количество символов: 2')
    .matches(NAME_REGEXP, 'Допустимые символы: А-я, -'),
  phone: Yup.string()
    .required('Необходимо указать телефон')
    .length(10, 'Некорректный телефон')
    .matches(PHONE_REGEXP, 'Формат телефона +7 (9##) ###-##-##'),
  acceptTerms: Yup.bool().oneOf([true], 'Нужно подтвердить свое согласие'),
});

export { LeadFormSchema };
