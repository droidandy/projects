export enum DebitCardRoutes {
  GRAN_TURISMO = 'gran-turismo',
  AUTO_DRIVE = 'auto-drive',
  ACTIVE_SOCIAL = 'active-social',
  ACTIVE_CASHBACK = 'active-cashback',
  TRAVEL = 'dorozhnaya',
}

export const DebitCardMetaMap = {
  [DebitCardRoutes.GRAN_TURISMO]: {
    title: 'Дебетовая карта Gran Turismo: кешбэк до 10%, выплата до 5% на остаток',
    subTitle:
      'Дебетовая карта Gran Turismo: кешбэк до 10%, выплата до 5% на остаток, бесплатная выдача наличных за рубежом. Доставим карту без посещения офиса!',
  },
  [DebitCardRoutes.AUTO_DRIVE]: {
    title: 'Дебетовая карта Auto Drive: кешбэк до 20%, бесплатное пополнение и снятие',
    subTitle:
      'Дебетовая карта Auto Drive: кешбэк до 20%, бесплатное годовое обслуживание, бесплатное пополнение и снятие наличных, до 1% надбавке к ставке по сберегательному продукту',
  },
  [DebitCardRoutes.ACTIVE_SOCIAL]: {
    title: 'Социальная Активная карта: до 4,5% на годовой остаток в рублях, бесплатное снятие наличных',
    subTitle:
      'Дебетовая Активная карта: кешбэк до 20%, до 4,5% на годовой остаток в рублях, бесплатное снятие наличных',
  },
  [DebitCardRoutes.ACTIVE_CASHBACK]: {
    title: 'Дебетовая Активная карта: до 4,5% на годовой остаток в рублях, бесплатное снятие наличных',
    subTitle: 'Дебетовая Активная карта: кешбэк до 3%, до 4,5% на годовой остаток в рублях, бесплатное снятие наличных',
  },
  [DebitCardRoutes.TRAVEL]: {
    title: 'Дебетовая Дорожная карта: кешбэк до 5%, 3 месяца бесплатного обслуживания',
    subTitle:
      'Дебетовая Дорожная карта - это бесплатное пополение с карт других банков, кешбэк до 5%, 3 месяца бесплатного обслуживания\n',
  },
};
