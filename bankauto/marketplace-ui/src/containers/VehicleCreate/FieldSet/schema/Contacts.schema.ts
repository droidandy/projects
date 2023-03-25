import * as Yup from 'yup';

const NotAuthorizedMessage = 'Войдите или зарегистрируйтесь для продолжения';

export const RegistrationSchema = Yup.object({
  phone: Yup.string().length(10, 'Некорректный телефон').required('Укажите телефон').nullable(),
}).defined();

export const AuthenticationSchema = Yup.object({
  firstName: Yup.string()
    .matches(/^[А-ЯЁа-яё\\-\\'\\.\s]*$/, "Допустимые символы: А-я, -, ., '")
    .min(2, 'Минимальное число символов: 2')
    .max(50, 'Максимальное число символов: 50')
    .required('Укажите имя')
    .nullable(),
  email: Yup.string().nullable().email(),
}).defined();

export const AuthorizationSchema = Yup.object({
  authSuccess: Yup.number().min(1, NotAuthorizedMessage).required(NotAuthorizedMessage).nullable(),
}).defined();
