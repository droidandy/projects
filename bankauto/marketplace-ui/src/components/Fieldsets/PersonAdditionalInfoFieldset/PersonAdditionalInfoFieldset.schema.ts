import * as Yup from 'yup';
import { isValid } from 'helpers/validations/date';
import { AdditionalDocumentType } from 'constants/credit';
import { isIssueDateLess10 } from 'helpers/validations/passport';

const DRIVERS_LICENSE_REGEXP = /^\d{2}\s[А-Я0-9]{2}\s\d{6}$/;
const INTERNATIONAL_PASSPORT_REGEXP = /\d{2}\s?\d{7}/;
const MILITARY_ID_REGEXP = /^[А-Я]{2}\s\d{7}$/;
const SNILS_REGEXP = /^\d{3}-\d{3}-\d{3}\s\d{2}$/;

const PersonAdditionalInfoFieldsetSchema = (hasAddiionalDocumentMetaFields: boolean = false) =>
  Yup.object().shape({
    educationType: Yup.string().nullable().required('Необходимо указать образование'),
    maritalStatus: Yup.string().nullable().required('Необходимо указать семейный статус'),
    numberOfDependants: Yup.number()
      .min(0, 'Не может быть меньше 0')
      .max(9, 'Не может быть больше 9')
      .integer('Должно быть целым числом'),
    additionalDocumentType: Yup.string().nullable().required('Необходимо указать тип доп. документа'),
    additionalDocumentFullName: hasAddiionalDocumentMetaFields
      ? Yup.string()
          .required('Необходимо указать серию и номер')
          .when('additionalDocumentType', {
            is: AdditionalDocumentType.DRIVERS_LICENSE,
            then: Yup.string()
              .min(10, 'Минимальное количество символов: 10')
              .max(14, 'Максимальное количество символов: 14')
              .matches(DRIVERS_LICENSE_REGEXP, 'Допустимые символы: А-я, 0-9, пробел'),
          })
          .when('additionalDocumentType', {
            is: AdditionalDocumentType.INTERNATIONAL_PASSPORT,
            then: Yup.string().matches(INTERNATIONAL_PASSPORT_REGEXP, 'Неверный формат'),
          })
          .when('additionalDocumentType', {
            is: AdditionalDocumentType.MILITARY_ID,
            then: Yup.string().matches(MILITARY_ID_REGEXP, 'Неверный формат'),
          })
          .when('additionalDocumentType', {
            is: AdditionalDocumentType.SNILS,
            then: Yup.string().matches(SNILS_REGEXP, 'Неверный формат'),
          })
      : Yup.string().notRequired(),
    additionalDocumentIssuedAt: hasAddiionalDocumentMetaFields
      ? Yup.string().when('additionalDocumentType', {
          is: AdditionalDocumentType.SNILS,
          then: Yup.string().notRequired(),
          otherwise: Yup.string()
            .required('Необходимо указать дату выдачи')
            .length(10, 'Необходимо указать дату выдачи целиком')
            .matches(/^[0-9\\.]*$/, 'Введите дату через точки')
            .test('isValid', 'Дата должна быть действительной', isValid)
            .when('additionalDocumentType', {
              is: (additionalDocumentType) =>
                [AdditionalDocumentType.DRIVERS_LICENSE, AdditionalDocumentType.INTERNATIONAL_PASSPORT].includes(
                  additionalDocumentType,
                ),
              then: Yup.string().test('isLessThan10', 'Документ требует замены', function (value) {
                return !value ? false : isIssueDateLess10(value);
              }),
            }),
        })
      : Yup.string().notRequired(),
  });

export { PersonAdditionalInfoFieldsetSchema };
