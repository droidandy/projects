import { VehicleFormData, VehicleFormDataOption } from './VehicleFormType';

export type Node = {
  id: number;
  name: string;
  alias: string;
};

export enum ReviewStatus {
  // На модерации
  MODERATION,
  // Опубликован
  PUBLISHED,
  // Отклонен
  REJECTED,
}

export type ReviewVehicleCharacteristics = {
  // Бренд
  brand: Node;
  // Модель
  model: Node;
  // Поколение
  generation: Node;
  // Год выпуска
  year: number;
  // Кузов
  bodyType: Node;
  // Трансмиссия
  transmission: Node;
  // Привод
  drive: Node;
  // Двигатель
  engine: Node;
  // Комплектация
  avitoModificationId: number;
  // Мощность
  power: number;
  // Объем
  volume: string;
  // Срок владения
  ownershipTerm: Node;
  // Пробег
  mileage: number;
  // Потребление по трассе
  highwayFuelConsumption: number;
  // Потребление в городе
  cityFuelConsumption: number;
};

export type Review = {
  // Идентификатор
  id: number;
  // Оценка
  rating: number;
  // Текст отзыва
  text: string;
  // Преимущества
  advantages: string | null;
  // Недостатки
  drawbacks: string | null;
  // Статус
  status: ReviewStatus;
  // Дата создания
  dateTime: number;
  // Имя клиента
  author: string;
  // Ссылки на фото
  // Массив с мапкой фото и размеров
  // Например, "100", "750", "max"
  images: Record<string, string>[];
  // Причина отклонения
  declinationReason: string | null;
} & ReviewVehicleCharacteristics;

export type Pagination = {
  // Ограничение на количество записей на страницу
  limit: number;
  // Отображать записи со смещением
  offset: number;
};

export type PagePagination = {
  limit: number;
  page: number;
};

type BrandModelParams = {
  // Марка авто
  brandId: number;
  // Модель авто
  modelId: number;
};

export type CurrentUserReviews = {
  data: CurrentUserReview[];
  pagination: PaginationData;
};

export type CurrentUserReview = Omit<Review, 'clientName'>;

export type RatingsCount = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type ReviewsStats = {
  // Средняя оценка
  averageRating: number;
  // Статистика по оценкам
  ratingsCount: RatingsCount;
};

export type CreateReview = {
  id: number;
};

export type CreateReviewParams = {
  // ID бренда
  brandId: number;
  // ID модели
  modelId: number;
  // ID типа кузова
  bodyTypeId: number;
  // ID поколения авто
  generationId: number;
  // ID модификации авто
  avitoModificationId: number;
  // ID типа двигателя
  engineId: number;
  // ID типа коробки передач
  transmissionId: number;
  // ID типа привода
  driveId: number;
  // Год выпуска авто
  year: number;
  // Текст отзыва
  text: string;
  // Преимущества авто
  advantages: string | null;
  // Недостатки авто
  drawbacks: string | null;
  // Оценка
  rating: number;
  // Пробег
  mileage: number;
  // Расход топлива по трассе
  highwayFuelConsumption: number;
  // Расход топлива по городу
  cityFuelConsumption: number;
  // Срок владения ТС
  ownershipTerm: number;
  // Фото
  pictures?: string[] | null;
};

export type ReviewsStatsParams = BrandModelParams;

export type CurrentUserReviewsParams = Partial<PagePagination> & { id?: number };

export type GetReviewsParams = Partial<PagePagination> & {
  id?: number;
  status?: number;
  brandId?: number;
  modelId?: number;
  page?: number;
};

export type PaginationData = {
  limit: number;
  offset: number;
  total: number;
};

export type FilteredReviews = {
  data: Review[];
  pagination: PaginationData;
};

export type ReviewCreateFormValuesIdentity = {
  brand: number | null;
  model: number | null;
  year: number | null;
};

export type ReviewCreateFormEquipmentValues = {
  body: number | null;
  generation: number | null;
  transmission: number | null;
  engine: number | null;
  drive: number | null;
  modification: number | null;
};

export type ReviewCreateFormHistoryValues = {
  mileage: number | null;
  ownershipTerm: number | null;
  highwayFuelConsumption: number | null;
  cityFuelConsumption: number | null;
};

export type ReviewCreateFormReviewValues = {
  text: string | null;
  advantages: string | null;
  drawbacks: string | null;
};

export type ReviewCreateFormMediaValues = {
  photos: string | null;
};

export type ReviewCreateFormRatingValues = {
  rating: number | null;
};

export type ReviewCreateFormValue = ReviewCreateFormValuesIdentity &
  ReviewCreateFormEquipmentValues &
  ReviewCreateFormHistoryValues &
  ReviewCreateFormReviewValues &
  ReviewCreateFormMediaValues &
  ReviewCreateFormRatingValues;

export type Generation = {
  // Год начала производства.
  startYear: number;
  // Год окончания производства.
  endYear: number;
  // Id модели.
  modelId: number;
  // Название модели.
  modelName: string;
} & Node;

export type Modification = {
  // Мощность двигателя.
  power: number;
  // Год окончания производства.
  transmissionId: number;
  // Объём двигателя.
  volume: string;
} & Node;

export type ReviewFilterDataParams = Partial<{ year: number } & BrandModelParams>;

export type ReviewCreateFormDataDTO = {
  brands: Node[];
  models: Node[];
  years: number[];
  bodies: Node[];
  generations: Generation[];
  engines: Node[];
  drives: Node[];
  transmissions: Node[];
  modifications: Modification[];
  ownershipTerm: Node[];
};

export type ReviewCreateFormData = Omit<VehicleFormData, 'city' | 'color' | 'stickers'> & {
  ownershipTerm: VehicleFormDataOption[];
};

export interface ReviewCreateFormDataParams {
  brandId?: number;
  modelId?: number;
  year?: number;
  bodyTypeId?: number;
  generationId?: number;
  driveId?: number;
  transmissionId?: number;
  engineId?: number;
  modificationId?: number;
  ownershipTerm?: number;
}
