import * as Yup from 'yup';
import { emailValidation } from 'components/Inputs/InputEmail';

const optionalNamePartValidator = Yup.lazy((value) =>
  value
    ? Yup.string()
        .matches(/^[А-ЯЁа-яё\\-\\'\\.\s]*$/, "Допустимые символы: А-я, -, ., '")
        .min(2, 'Минимальное число символов: 2')
        .max(50, 'Максимальное число символов: 50')
    : Yup.string().nullable(),
);

export const ProfileInfoSchema = Yup.object().shape({
  firstName: Yup.string()
    .required('Укажите имя')
    .matches(/^[А-ЯЁа-яё\\-\\'\\.\s]*$/, "Допустимые символы: А-я, -, ., '")
    .min(2, 'Минимальное число символов: 2')
    .max(50, 'Максимальное число символов: 50')
    .nullable(),
  lastName: optionalNamePartValidator,
  patronymicName: optionalNamePartValidator,
  email: emailValidation().required('Email обязателен для заполнения'),
  cityId: Yup.number().required('Укажите Ваш город'),
});
