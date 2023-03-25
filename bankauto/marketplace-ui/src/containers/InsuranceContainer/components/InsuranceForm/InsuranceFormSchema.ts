import * as Yup from 'yup';
import { getYearsInterval, isBetweenDaysCount, isPast, isPastOrToday, isValid } from 'helpers/validations/date';
import { emailValidation } from 'components/Inputs/InputEmail/InputEmail';
import { phoneValidation } from 'components/Inputs/InputPhone';
import { dateValidation } from 'components/Inputs/InputDate';
import { Address } from 'types/Address';
import { INSURANCE_DRIVERS_COUNT, INSURANCE_FORM_TYPE } from 'types/Insurance';

export const MainBlockSchema = Yup.object({
  city: Yup.string().required('Укажите город').typeError('Укажите город'),
  formType: Yup.number().required('Укажите тип продукта').typeError('Укажите тип продукта'),
  brand: Yup.object().required('Укажите марку').typeError('Укажите марку'),
  model: Yup.object().required('Укажите модель').typeError('Укажите модель'),
  productionYear: Yup.object().required('Укажите год выпуска').typeError('Укажите год выпуска'),
  bodyType: Yup.object().required('Укажите тип кузова').typeError('Укажите тип кузова'),
  power: Yup.number()
    .typeError('Укажите мощность автомобиля')
    .required('Укажите мощность автомобиля')
    .positive()
    .lessThan(10 ** 3),
  insuranceType: Yup.number().required('Укажите тип страхования'),
  vehicleType: Yup.string().when('formType', (formType: INSURANCE_FORM_TYPE, schema: any) => {
    return +formType !== INSURANCE_FORM_TYPE.OSAGO ? schema.required('Укажите тип автомобиля') : schema.optional();
  }),
  vehicleOwningType: Yup.number().when('formType', (formType: INSURANCE_FORM_TYPE, schema: any) => {
    return +formType !== INSURANCE_FORM_TYPE.OSAGO
      ? schema.required('Укажите в кредите ли автомобиль')
      : schema.optional();
  }),
  price: Yup.number().when('formType', (formType: INSURANCE_FORM_TYPE, schema: any) => {
    return +formType !== INSURANCE_FORM_TYPE.OSAGO
      ? schema
          .required('Укажите стоимость автомобиля')
          .typeError('Укажите стоимость автомобиля')
          .positive()
          .lessThan(10 ** 10)
      : schema.nullable().optional();
  }),
});

const UserBlockSchema = Yup.object({
  firstName: Yup.string()
    .required('Укажите имя')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
    .nullable(),
  lastName: Yup.string()
    .required('Укажите фамилию')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
    .nullable(),
  middleName: Yup.string()
    .required('Укажите отчество')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
    .nullable(),
  phone: phoneValidation().required('Укажите телефон'),
});

export const DriverSchema = Yup.object({
  lastName: Yup.string()
    .required('Укажите фамилию')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле'),
  firstName: Yup.string()
    .required('Укажите имя')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле'),
  middleName: Yup.string()
    .required('Укажите отчество')
    .min(2, 'Некорректно заполнено поле')
    .max(133, 'Некорректно заполнено поле')
    .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле'),
  dateOfBirth: Yup.string()
    .required('Укажите дату рождения')
    .length(10)
    .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
    .test('isValid', 'Должно быть валидной датой', isValid)
    .test('isPast', 'Дата не должна быть в будущем', isPast)
    .test('18 years', 'Некорректно заполнено поле', function (value) {
      return getYearsInterval(value!) >= 18;
    }),
  sexCode: Yup.string().required('Укажите пол').typeError('Укажите пол'),
  drivingExperienceDateStart: Yup.string()
    .required('Укажите дату выдачи ВУ')
    .length(10, 'Некорректно заполнено поле')
    .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
    .test('isValid', 'Должно быть валидной датой', isValid)
    .test('isPast', 'Дата не должна быть в будущем', isPast)
    .test('18 years', 'Некорректно заполнено поле', function (value) {
      if (!this.parent.dateOfBirth) {
        return false;
      }

      return getYearsInterval(this.parent.dateOfBirth, value!) >= 18;
    }),
  driverLicenseNumber: Yup.string()
    .required('Укажите серию и номер ВУ')
    .min(11, 'Некорректно заполнено поле')
    .matches(/^[0-9\s]*$/, 'Некорректно заполнено поле'),
});

function personBlockSchema(withInitials: boolean = true) {
  const schema = Yup.object().shape({
    dateOfBirth: Yup.string()
      .required('Укажите дату рождения')
      .min(10)
      .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
      .test('isValid', 'Должно быть валидной датой', isValid)
      .test('isPast', 'Дата не должна быть в будущем', isPast),
    passportNumber: Yup.string()
      .required('Укажите серию и номер паспорта')
      .min(10)
      .matches(/^[0-9\s]*$/, 'Некорректно заполнено поле'),
    passportIssuer: Yup.string()
      .required('Укажите кем выдан')
      .trim()
      .matches(/^[А-Яа-яёЁ0-9№.]+([-\s][А-Яа-яёЁ0-9№.]+)*$/, 'Некорректно заполнено поле')
      .max(200),
    passportIssuedAt: Yup.string()
      .required('Укажите дату выдачи')
      .min(10)
      .length(10)
      .matches(/^[0-9\\.]*$/, 'Некорректно заполнено поле')
      .test('isValid', 'Должно быть валидной датой', isValid)
      .test('isPast', 'Дата не должна быть в будущем', isPast)
      .test('14 years', 'Некорректно заполнено поле', function (value) {
        if (!this.parent.dateOfBirth) {
          return false;
        }

        return getYearsInterval(this.parent.dateOfBirth, value!) >= 14;
      }),
    registration: Yup.object<{ value: Address }>()
      .required('Укажите адрес регистрации')
      .test('isValid', 'Укажите адрес регистрации', (value) => value?.value.house != null),
  });

  if (withInitials) {
    return schema.concat(
      // @ts-ignore
      Yup.object({
        lastName: Yup.string()
          .nullable()
          .min(2, 'Некорректно заполнено поле')
          .max(133, 'Некорректно заполнено поле')
          .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
          .test('req', 'Укажите фамилию', function (value) {
            if (this.parent.disableName) {
              return true;
            }
            return !!value && value.length > 0;
          }),
        firstName: Yup.string()
          .nullable()
          .min(2, 'Некорректно заполнено поле')
          .max(133, 'Некорректно заполнено поле')
          .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
          .test('req', 'Укажите имя', function (value) {
            if (this.parent.disableName) {
              return true;
            }
            return !!value && value.length > 0;
          }),
        middleName: Yup.string()
          .nullable()
          .min(2, 'Некорректно заполнено поле')
          .max(133, 'Некорректно заполнено поле')
          .matches(/^[А-Яа-яёЁ]+([-\s][А-Яа-яёЁ]+)*$/, 'Некорректно заполнено поле')
          .test('req', 'Укажите отчество', function (value) {
            if (this.parent.disableName) {
              return true;
            }
            return !!value && value.length > 0;
          }),
      }),
    );
  }

  return schema;
}

const InsurantSchema = Yup.object().shape({
  insurant: personBlockSchema(false),
});

const OwnerSchema = Yup.object().shape({
  owner: Yup.object().when('isInsurantOwner', (isInsurantOwner: boolean, schema: any) => {
    return isInsurantOwner ? schema.optional() : schema.concat(personBlockSchema(true));
  }),
});

export const DriversSchema = Yup.object().shape({
  drivers: Yup.array().when('insuranceType', (insuranceType: number, schema: any) => {
    return insuranceType === INSURANCE_DRIVERS_COUNT.SEVERAL ? schema.of(DriverSchema) : schema;
  }),
});

export const AdvancedBlockSchema = Yup.object().shape({
  isVehicleNotRegistered: Yup.boolean().required(),
  series: Yup.string().when('isVehicleNotRegistered', (isVehicleNotRegistered: any, schema: any) => {
    return isVehicleNotRegistered
      ? schema.optional()
      : schema
          .required('Укажите гос. номер')
          .matches(/^[АВЕКМНОРСТУХ]\d{3}[АВЕКМНОРСТУХ]{2}\d{2,3}$/, 'Некорректно заполнено поле');
  }),
  vin: Yup.string()
    .required('Укажите VIN')
    .matches(/[A-Z0-9]/, 'Некорректно заполнено поле')
    .max(17, 'Некорректно заполнено поле')
    .min(14, 'Некорректно заполнено поле'),
  ptsSeries: Yup.string()
    .required('Укажите ПТС (серия и номер)')
    .matches(/[А-ЯЁ0-9]/, 'Некорректно заполнено поле')
    .min(10, 'Некорректно заполнено поле')
    .max(15, 'Некорректно заполнено поле'),
  ptsIssuedAt: dateValidation()
    .required('Укажите дату выдачи ПТС')
    .test('isPastOrToday', 'Некорректно заполнено поле', isPastOrToday)
    .test('More than production year', 'Некорректно заполнено поле', function (value) {
      if (!this.parent.productionYear) {
        return false;
      }
      return getYearsInterval(value!, new Date(this.parent.productionYear.value, 0), true) >= 0;
    }),
  insuranceIssuedAt: dateValidation()
    .required('Укажите дату начала договора страхования')
    .test('isFutureOrToday', 'Некорректно заполнено поле', (v) => isBetweenDaysCount(v, 3, 60)),
});

export const EmailBlockSchema = Yup.object({
  email: emailValidation().required('Необходимо указать email'),
});

const InsuranceFormSchema = Yup.object({})
  .concat(MainBlockSchema)
  .concat(UserBlockSchema)
  .concat(InsurantSchema)
  .concat(OwnerSchema)
  .concat(DriversSchema)
  .concat(AdvancedBlockSchema)
  .concat(EmailBlockSchema);

export default InsuranceFormSchema;
