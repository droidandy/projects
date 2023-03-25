import * as Yup from 'yup';

export const AdditionalInformationSchema = Yup.object().shape({
  vin: Yup.string().nullable().length(17, 'Некорректный формат VIN-кода') as any,
});
