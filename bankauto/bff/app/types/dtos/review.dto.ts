type Node = {
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

export type ReviewDTO = {
  vehicleCharactecteristics: {
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
    equipment: Node;
    // Мощность
    power: number;
    // Объем
    volume: string;
    // Срок владения
    ownershipTerm: number;
    // Пробег
    mileage: number;
    // Потребление по трассе
    highwayFuelConsumption: number;
    // Потребление в городе
    cityFuelConsumption: number;
  };
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
  clientName: string;
  // Ссылки на фото
  images: string[];
  // Ссылка на фото для превью
  previewImage: string | null;
  // Причина отклонения
  cancelReason: string | null;
};

export type Pagination = {
  // Ограничение на количество записей на страницу
  limit: number | string;
  // Отображать записи со смещением
  offset: number | string;
};

type BrandModelParams = {
  // Марка авто
  brandId: number;
  // Модель авто
  modelId: number;
};

export type ReviewFilterParams = {
  id?: number;
  // Статус отзыва
  status?: ReviewStatus;
} & Partial<BrandModelParams> &
  Partial<Pagination>;

export type CurrentUserReviewsParams = Pagination;

export type CurrentUserReviewDTO = Omit<ReviewDTO, 'clientName' | 'images' | 'previewImage'> & {
  // Ссылка на фото
  imageUrl: string;
};

export type ReviewsStatsParams = BrandModelParams;

export type ReviewStatsDTO = {
  // Средняя оценка
  averageRating: number;
  // Статистика по оценкам
  ratingsCount: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
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
  equipmentId: number;
  // ID типа двигателя
  engineId: number;
  // ID типа коробки передач
  transmissionId: number;
  // ID типа привода
  driveId: number;
  // Год выпуска авто
  year: number;
  // Текст отзыва
  text: number;
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
  pictures: string[];
};

export type CreateReviewDTO = {
  id: number;
};

export type EditReviewParams = { id: number } & CreateReviewParams;

export type RemoveReviewParams = { id: number };

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

export type ReviewFilterData = {
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
