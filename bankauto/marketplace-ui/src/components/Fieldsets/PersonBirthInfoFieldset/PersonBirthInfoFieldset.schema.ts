import { isCorrectBirthDate, isPast, isValid } from 'helpers/validations/date';
import * as Yup from 'yup';

const PersonBirthInfoFieldsetSchema = (creditTerm?: number) =>
  Yup.object().shape({
    birthPlace: Yup.string()
      .required('Необходимо указать место рождения')
      .matches(/^[А-Яа-яёЁ0-9№.]+([-\s][А-Яа-яёЁ0-9№.]+)*$/, 'Используйте кириллицу без спец.символов')
      .max(100, 'Максимальное количество символов: 100'),
    birthDate: Yup.string()
      .required('Необходимо указать дату рождения')
      .min(10, 'Необходимо указать дату рождения целиком')
      .matches(/^[0-9\\.]*$/, 'Введите дату через точки')
      .test('isValid', 'Дата должна быть действительной', isValid)
      .test('isPast', 'Дата не должна быть в будущем', isPast)
      .test('correct', 'Возраст на момент погашения от 21 до 70', function (value) {
        return !value ? true : isCorrectBirthDate(value, [21, 70], creditTerm);
      }),
  });

export { PersonBirthInfoFieldsetSchema };
