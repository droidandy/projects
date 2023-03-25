import * as Yup from 'yup';

export const PriceSchema = Yup.object({
  price: Yup.number().max(99000000, 'Не более 99000000').min(1, 'Укажите цену').required('Укажите цену').nullable(),
}).defined();
