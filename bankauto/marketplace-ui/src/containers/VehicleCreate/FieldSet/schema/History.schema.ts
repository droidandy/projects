import * as Yup from 'yup';

export const HistorySchema = Yup.object({
  condition: Yup.number().required('Необходимо указать состояние автомобиля').nullable(),
  mileage: Yup.number().required('Необходимо указать пробег автомобиля').nullable(),
  ownersNumber: Yup.number().min(1).required('Укажите количество владельцев').nullable(),
}).defined();
