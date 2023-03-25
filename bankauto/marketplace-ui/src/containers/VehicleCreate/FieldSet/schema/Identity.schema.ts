import * as Yup from 'yup';

export const IdentitySchema = Yup.object({
  city: Yup.number().required('Необходимо указать город').nullable(),
  brand: Yup.number().required('Необходимо указать марку автомобиля').nullable(),
  model: Yup.number().required('Необходимо указать модель автомобиля').nullable(),
  year: Yup.number().required('Необходимо указать год выпуска').nullable(),
}).defined();
