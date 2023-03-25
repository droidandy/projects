import { pluralize } from 'helpers/pluralize';

export const pluralizeCar = (count: number) => pluralize(count, ['автомобиль', 'автомобиля', 'автомобилей']);

export const pluralizeGeneration = (count: number) => pluralize(count, ['Поколение', 'Поколения', 'Поколений']);

export const pluralizeModel = (count: number) => pluralize(count, ['Модель', 'Модели', 'Моделей']);

export const pluralizeBrand = (count: number) => pluralize(count, ['Бренд', 'Бренда', 'Брендов']);

export const pluralizeAds = (count: number) => pluralize(count, ['объявление', 'объявления', 'объявлений']);

export const pluralizeOffer = (count: number) => pluralize(count, ['предложение', 'предложения', 'предложений']);

export const pluralizeDealer = (count: number) => pluralize(count, ['дилера', 'дилеров']);

export const pluralizeMonth = (count: number) => pluralize(count, ['месяц', 'месяца', 'месяцев']);

export const pluralizeCard = (count: number) => pluralize(count, ['карта', 'карты', 'карт']);

export const pluralizeReview = (count: number) => pluralize(count, ['отзыв', 'отзыва', 'отзывов']);
