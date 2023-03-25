import * as Yup from 'yup';

export const VinSchema = Yup.object({
  vin: Yup.string()
    .matches(/^[0123456789ABCDEFGHJKLMNPRSTUVWXYZ]{17}$/, 'Некорректный VIN')
    .nullable(),
}).defined();
