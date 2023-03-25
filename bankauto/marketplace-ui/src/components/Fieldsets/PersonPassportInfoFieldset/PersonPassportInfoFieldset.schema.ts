import { isCorrectBirthDate, isPast, isValid } from 'helpers/validations/date';
import * as Yup from 'yup';
import { isIssueDateMore20, isIssueDateMore45 } from 'helpers/validations/passport';

const PersonPassportInfoFieldsetSchema = (creditTerm?: number) =>
  Yup.object().shape({
    passport: Yup.string()
      .required('Необходимо указать серию и номер')
      .min(10, 'Серия и номер состоят из 4 и 6 цифр')
      .matches(/^[0-9\s]*$/, 'Серия и номер состоят из 4 и 6 цифр'),
    passportIssuedAt: Yup.string()
      .required('Необходимо указать дату выдачи')
      .length(10, 'Необходимо указать дату выдачи целиком')
      .matches(/^[0-9\\.]*$/, 'Введите дату через точки')
      .test('isValid', 'Дата должна быть действительной', isValid)
      .test('isPast', 'Не позднее текущей даты', isPast)
      .test('passportIssueDateLess20', 'Паспорт требует замены в 20 лет', function (value) {
        return !value ? true : isIssueDateMore20(this.parent.birthDate, value);
      })
      .test('passportIssueDateLess45', 'Паспорт требует замены в 45 лет', function (value) {
        return !value ? true : isIssueDateMore45(this.parent.birthDate, value);
      })
      .test('invaliDateOfBirth', 'Некорректно заполено поле "Дата рождения"', function (value) {
        return !value ? true : isCorrectBirthDate(this.parent.birthDate, [21, 70], creditTerm);
      }),
    passportIssuerCode: Yup.string()
      .required('Необходимо указать код подразделения')
      .matches(/^[0-9-]*$/, 'Код подразделения состоит из 6 цифр'),
    passportIssuer: Yup.string()
      .required('Необходимо указать, кем выдан паспорт')
      .matches(/^[А-Яа-яёЁ0-9№.,-]+([-\s][А-Яа-яёЁ0-9№.,-]+)*$/, 'Используйте кириллицу без спец.символов')
      .max(200, 'Допускается не более 200 символов'),
  });

export { PersonPassportInfoFieldsetSchema };
