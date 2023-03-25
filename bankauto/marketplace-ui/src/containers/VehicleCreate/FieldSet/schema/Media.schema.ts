import * as Yup from 'yup';

export const MediaSchema = Yup.object({
  imagesExterior: Yup.string()
    .min(1, 'Добавьте фотографии экстерьера автомобиля!')
    .required('Добавьте фотографии экстерьера автомобиля!')
    .nullable(),
}).defined();
