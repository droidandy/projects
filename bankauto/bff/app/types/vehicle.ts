import { Vehicle } from '@marketplace/ui-kit/types';

export type VehicleListItemBrand = {
  // Id записи
  id: number;
  // Название
  name: string;
  // Псевдоним
  alias: string;
};

export type VehicleListItemModel = {
  // Id записи
  id: number;
  // Название
  name: string;
  // Псевдоним
  alias: string;
};

export type VehicleListItemGeneration = {
  // Id записи
  id: number;
  // Название
  name: string;
  // Псевдоним
  alias: string;
};

export type VehicleListItemColor = {
  // Название цвета
  name: string;

  // Шестнадцатеричный цветовой код c #.
  code: string;
};

// Контейнер изображения.
// Содержит мапинг размера изображения и его url.
// size - строка, содержащая число или max
export type Photo = { [size: string]: string };

// Сгруппированый список опций.
export type OptionsGroup = { [groupName: string]: Options };

// Список опций
export type Options = string[];

export type VehicleBaseListItem = {
  // vehicle ID
  id: number;
  // Тип авто (new - новое, used - поддержанное)
  type: 'new' | 'used';
  // Статус авто.
  //
  // 0 - На проверке
  // 2 - Опубликовано
  // 3 - Отклонено
  // 4 - Снято с публикации (офис или компания отключена)
  // 5 - Продан
  // 6 - В очереди на публикацию
  // 7 - Снято с публикации клиентом
  // 8 - Ошибка публикации
  // 9 - На публикации
  status: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
  // Год выпуска
  year: number;
  // VIN с скрытыми символами по маске WBA31DC0*0C****04
  vin: string;
  // Пробег
  mileage: number;
  // Брэнд
  brand: VehicleListItemBrand;
  // Модель
  model: VehicleListItemModel;
  // Поколение
  generation: VehicleListItemGeneration;
  // Название компании (дилера)
  company: string;
  // Название комплектации
  equipment: string;
  // Цвет
  color: VehicleListItemColor;
  // Название типа кузова
  body: string;
  // Название типа трансмиссии
  transmission: string;
  // Название типа привода
  drive: string;
  // Название типа двигателя
  engine: string;
  // Объем двигателя
  engineVolume: string;
  // Мощность двигателя
  enginePower: number;
  // Подарки
  gifts: string[];
  // Фотографии
  photos: Photo[];
};

export type VehicleBaseItem = VehicleBaseListItem & {
  // Адрес офиса продаж
  address: string;

  // Опции, сгруппированные по группам с учётом внутренней сортировки
  options: OptionsGroup;

  // URL видео на Youtube
  videoUrl?: string;
};

export type VehicleInstalmentListItem = VehicleBaseListItem & {
  // Срок рассрочки
  installmentMonths: number;
  // Ежемесячный платеж
  installmentPayment: number;
};

export type InstallmentPaymentsType = {
  [monthsCount: number]: number;
};

export type VehicleInstalmentItem = VehicleBaseItem & {
  numberOfOwners: number;
  ptsType: unknown;
  price: number;
  // Возможные параметры рассрочки: количество месяцев - сумма платежа
  installmentPayments: InstallmentPaymentsType;
};

export type VehicleContacts = {
  // Начало удобного времени
  timeFrom?: number;
  // Окончание удобного времени
  timeTo?: number;
  // Гео широта места просмотра
  latitude?: number;
  // Гео долгота места просмотра
  longitude?: number;
  // Адрес
  address?: string;
};

export type WithVehicleContacts = {
  contacts: VehicleContacts;
};

export type VehicleWithContacts = { vehicle: Vehicle } & WithVehicleContacts;
