import * as Yup from 'yup';

export const AutostatSchema = Yup.object().shape({
  brand: Yup.number().required('Необходимо указать бренд'),
  model: Yup.number().required('Необходимо указать модель'),
  year: Yup.number().required('Необходимо указать год выпуска'),
  condition: Yup.number().required('Необходимо указать состояние автомобиля'),
  mileage: Yup.number().required('Необходимо указать пробег автомобиля'),
});
