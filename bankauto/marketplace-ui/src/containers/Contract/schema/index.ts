import * as Yup from 'yup';

import { isValid } from 'helpers/validations/date';
import { phoneValidation } from 'components/Inputs/InputPhone';

const nameValidator = Yup.lazy((value) =>
  value
    ? Yup.string()
        .matches(/^[А-ЯЁа-яё\\-\\'\\.\s]*$/, "Допустимые символы: А-я, -, ., '")
        .min(2, 'Минимальное число символов: 2')
        .max(50, 'Максимальное число символов: 50')
    : Yup.string().nullable(),
);

const addressValidator = Yup.lazy((value) =>
  value
    ? Yup.string().min(2, 'Минимальное число символов: 2').max(150, 'Максимальное число символов: 150')
    : Yup.string().nullable(),
);

const dateValidator = Yup.lazy((value) =>
  value
    ? Yup.string()
        .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
        .test('isValid', 'Должно быть валидной датой', isValid)
    : Yup.string().nullable(),
);

const personBlockSchema = (personType: string) => {
  const schema = Yup.object().shape({
    [`${personType}Surname`]: nameValidator,
    [`${personType}Name`]: nameValidator,
    [`${personType}SecondName`]: nameValidator,
    [`${personType}Birthday`]: Yup.string()
      .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
      .test('isValid', 'Должно быть валидной датой', isValid),
    [`${personType}BirthPlace`]: addressValidator,
    [`${personType}PassportDate`]: dateValidator,
    [`${personType}PassportSeries`]: Yup.string()
      .length(4, 'Некорректная серия')
      .matches(/^[0-9]*$/, 'Некорректная серия')
      .nullable(),
    [`${personType}PassportNumber`]: Yup.string()
      .length(6, 'Некорректный номер')
      .matches(/^[0-9]*$/, 'Некорректный номер')
      .nullable(),
    [`${personType}PassportIssuer`]: addressValidator,
    [`${personType}Address`]: addressValidator,
  });

  if (personType === 'buyer') {
    return schema.concat(
      // @ts-ignore
      Yup.object({
        phone: phoneValidation().nullable(),
      }),
    );
  }

  return schema;
};

export const DateAndPlaceSchema = Yup.object({
  location: addressValidator,
  date: dateValidator,
});

export const OwnerPersonSchema = personBlockSchema('seller');

export const BuyerPersonSchema = personBlockSchema('buyer');

export const VehicleSchema = Yup.object({
  brand: Yup.number().nullable(),
  model: Yup.number().nullable(),
  year: Yup.number().nullable(),
  vehicleVin: Yup.string()
    .matches(/^[0-9ABCDEFGHJKLMNPRSTUVWXYZ]{14,17}$/, 'VIN должен состоять минимум из 14 корректных знаков')
    .nullable(),
  body: Yup.number().nullable(),
  engineModel: nameValidator,
  engineNumber: Yup.string()
    .matches(/^[2-9ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/, 'Номер двигателя должен состоять из 17 корректных знаков')
    .nullable(),
  chassisNumber: Yup.string()
    .matches(
      /^[0-9BCDEFGHJKLMNPRSTUVWXYZ\\-]{9,17}$/,
      'Номер рамы/шасси должен состоять минимум из 9 корректных знаков',
    )
    .nullable(),
  bodyNumber: Yup.string()
    .nullable()
    .matches(/^[0123456789ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/, 'Номер кузова должен состоять из 17 корректных знаков')
    .nullable(),
  color: Yup.number().nullable(),
  power: Yup.number().nullable(),
  volume: Yup.number().nullable(),
  vehiclePassportDate: dateValidator,
  vehiclePassportSeries: Yup.string()
    .max(4, 'Должно быть 4 символа')
    .matches(/^[ABCDEFGHJKLMNPRSTUVWXYZ]{2}\d{2}$/, 'Некорректная серия ПТС')
    .nullable(),
  vehiclePassportNumber: Yup.string()
    .matches(/^\d{6}$/, 'Некорректный номер ПТС')
    .nullable(),
  vehiclePassportIssuer: addressValidator,
  registerPassportDate: dateValidator,
  registerPassportSeries: Yup.string()
    .max(4, 'Должно быть 4 символа')
    .matches(/^(\d{4})|\d{2}[А-Я]{2}$/, 'Некорректная серия СТС')
    .nullable(),
  registerPassportNumber: Yup.string()
    .matches(/^[0-9]{6}$/, 'Некорректный номер СТС')
    .nullable(),
  registerPassportIssuer: addressValidator,
  mileage: Yup.number().nullable(),
  number: Yup.string()
    .matches(/^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/, 'Некорректный Гос. номер')
    .nullable(),
  price: Yup.number().min(1, 'Укажите цену').max(99000000, 'Не более 99000000').nullable(),
});

export const ContractFormSchema = OwnerPersonSchema.concat(BuyerPersonSchema)
  .concat(DateAndPlaceSchema)
  .concat(VehicleSchema) as Yup.ObjectSchema<object, object>;
