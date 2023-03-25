import { DebitCardSmall } from 'store/types';

export const initialDebitCardList: DebitCardSmall[] = [
  {
    id: 145530404158,
    rankForDisplay: 10,
    title: 'Дорожная карта',
    shortDescription: 'Карта с повышенным кешбэком для ежедневных расходов автомобилиста',
    img: '/images/debitCards/dorozhnaya.jpg',
    tags: ['Авто', 'Кешбэк'],
    bonuses: [
      {
        title: 'Кешбэк на авто, рестораны и развлечения',
        valueSmallText: 'до',
        valueBigText: ' 5%',
      },
      {
        title: 'Бесплатное обслуживание',
        valueSmallText: '',
        valueBigText: '3 ',
        valueSmallText2: 'месяца',
      },
    ],
    keyConditions: [
      {
        title: 'Открытие\nи обслуживание',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
        tooltipText: `Бесплатно первые 3 месяца, далее при выполнении одного из условий:
– при оплате покупок картой от 10\u00A0000\u00A0руб. в месяц,
– при совокупном среднемесячном остатке от 50\u00A0000\u00A0руб. на всех счетах клиента в РГС Банке,
– при действующем кредите, привязанном к карте, в ином случае – 99\u00A0руб. в месяц.`,
        iconName: 'CreditCard',
      },
      {
        title: 'Пополнение\nи снятие с карты',
        valueSmallText: '',
        valueBigText: 'Без комиссии',
        tooltipText:
          'Бесплатное пополнение и снятие в банкоматах ПАО «РГС Банк» и банков-партнеров.\nБесплатное пополнение по номеру телефона через Систему быстрых платежей и при переводах по номеру карты через сервисы РГС Банка.',
        iconName: 'Percent',
      },
      {
        title: 'Кешбэк в категориях авто, рестораны и развлечения',
        valueSmallText: 'до ',
        valueBigText: '5%',
        iconName: 'Coffee',
      },
      {
        title: 'Кешбэк на все остальные\nпокупки',
        valueSmallText: '',
        valueBigText: '0,5%',
        hideInMobile: true,
      },
    ],
    advantages: ['Бесплатное пополнение с карт других банков', 'Тех.помощь на дороге с пакетом «Моя дорога»'],
    cardName: 'dorozhnaya',
    paymentSystems: ['mir', 'mastercard'],
    filter: ['cashback', 'mir', 'mastercard'],
    banners: [
      {
        imageUrl: '/images/debitCards/promo/promo-1.jpg',
        title: 'Повышенный кешбэк в категории "Авто"',
        subtitile: 'Автозапчасти, дорожные сборы, пошлины, прокат авто, автосервисы, автомойки, шиномонтаж',
        percent: '5',
      },
      {
        imageUrl: '/images/debitCards/promo/promo-2.jpg',
        title: 'Автоматизированные бензозаправки, горючее топливо.',
        percent: '4',
      },
      {
        imageUrl: '/images/debitCards/promo/promo-4.jpg',
        title: 'Рестораны и доставка\nиз ресторанов на дом. ',
        percent: '4',
      },
      {
        imageUrl: '/images/debitCards/promo/promo-3.jpg',
        title: 'Билеты на концерты, в театры, парки развлечений и кинотеатры',
        percent: '4',
      },
      {
        imageUrl: '/images/debitCards/promo/promo-5.jpg',
        title: 'Остальные покупки',
        percent: '0,5',
      },
    ],
    tariffs: [
      {
        title: 'Платежная система и категория карты',
        content: [{ contentTitle: 'Masterсard Platinum' }, { contentTitle: 'Мир Продвинутая' }],
      },
      {
        title: 'Валюта',
        content: [{ contentTitle: 'Рубли РФ' }],
      },
      {
        title: 'Обслуживание',
        content: [
          {
            contentTitle: 'Бесплатно',
            conditions: [
              'в первые 3 месяца, далее при выполнении одного из условий:',
              '– при покупках от 10 000 рублей в месяц',
              '– при совокупном среднемесячном остатке от 50 000 рублей на всех счетах клиента в РГС Банке',
              '– при действующем кредите, привязанном к карте',
            ],
          },
          { contentTitle: '99 рублей', conditions: ['в других случаях'] },
        ],
      },
      {
        title: 'Кешбэк на покупки',
        content: [
          {
            contentTitle: '5%',
            conditions: ['в категории «Авто» при оплате смартфоном или онлайн, в остальных случаях - 4%'],
          },
          {
            contentTitle: '4%',
            conditions: [
              'в категории «АЗС», «Рестораны», «Развлечения», при оплате смартфоном или онлайн, в остальных случаях - 3%',
            ],
          },
          {
            contentTitle: '0.5%',
            conditions: ['на остальные категории, кроме оплаты продуктов и операций-исключений'],
          },
        ],
      },
      {
        title: 'Снятие наличных и пополнение карты',
        content: [
          {
            contentTitle: 'Бесплатно',
            conditions: [
              '- в банкоматах ПАО Банк «ФК Открытие», ПАО «Сбербанк» (снятие), ПАО «ВТБ», АО «Альфа-Банк»',
              '- по номеру телефона через Систему быстрых платежей',
              '- при переводах по номеру карты через сервисы Банка',
            ],
          },
        ],
      },
      {
        title: 'Стоимость смс-информирования',
        content: [
          {
            contentTitle: '59 рублей',
            conditions: ['в месяц, начиная со второго месяца'],
          },
        ],
      },
    ],
  },
  {
    id: 150398573983,
    rankForDisplay: 20,
    title: 'Gran Turismo',
    shortDescription: 'Карта для путешествий',
    img: '/images/debitCards/gran-turismo.jpg',
    tags: ['Путешествия', 'Накопления', 'Кешбэк'],
    bonuses: [
      {
        title: 'Процент на остаток бонусами OneTwoTrip',
        valueSmallText: 'до',
        valueBigText: ' 5%',
      },
      {
        title: 'Кешбэк бонусами OneTwoTrip',
        valueSmallText: 'до',
        valueBigText: ' 10%',
      },
    ],
    keyConditions: [
      {
        title: 'Выдача наличных\nза рубежом',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Участие в программе доступа в бизнес-залы аэропортов',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Процент на остаток бонусами OneTwoTrip',
        valueSmallText: 'до',
        valueBigText: ' 5%',
      },
      {
        title: 'Кешбэк бонусами OneTwoTrip',
        valueSmallText: 'до',
        valueBigText: ' 10%',
      },
    ],
    fullConditions: [
      { label: 'Процент на остаток бонусами OneTwoTrip', value: 'до 5%' },
      { label: 'Кешбэк бонусами OneTwoTrip', value: 'до 10%' },
      { label: 'Бесплатная выдача наличных за рубежом', value: true },
      { label: 'Бесплатное участие в программе доступа в бизнес-залы аэропортов', value: true },
      { label: 'Бесплатное обслуживание при выполнении условий', value: true },
      { label: 'Платежная система', value: 'MasterCard' },
    ],
    advantages: [
      'Бесплатная выдача наличных за рубежом',
      'Бесплатное участие в программе доступа в бизнес-залы аэропортов',
      'Бесплатное обслуживание при выполнении условий',
    ],
    cardName: 'gran-turismo',
    paymentSystems: ['mastercard'],
    filter: ['travel', 'savings', 'cashback', 'mastercard'],
  },
  {
    id: 137339964400,
    rankForDisplay: 30,
    title: 'АвтоДрайв',
    shortDescription: 'Карта для увеличения дохода по сберегательным продуктам',
    img: '/images/debitCards/auto-drive.jpg',
    tags: ['Накопления', 'Кешбэк'],
    bonuses: [
      {
        title: 'Надбавка к ставке по сберегательному продукту',
        valueSmallText: 'до',
        valueBigText: ' 1%',
      },
      {
        title: 'Кешбэк от платежной системы «Мир»',
        valueSmallText: 'до',
        valueBigText: ' 20%',
      },
    ],
    keyConditions: [
      {
        title: 'Годовое\nобслуживание',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Пополнение и\nснятие наличных',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Надбавка к ставке по сберегательному продукту',
        valueSmallText: 'до',
        valueBigText: ' 1%',
      },
      {
        title: 'Кешбэк от платежной\nсистемы «Мир»',
        valueSmallText: 'до',
        valueBigText: ' 20%',
      },
    ],
    fullConditions: [
      { label: 'Надбавка к ставке по сберегательному продукту', value: 'до 1%' },
      { label: 'Кешбэк от платежной системы «Мир»', value: 'до 20%' },
      { label: 'Бесплатное годовое обслуживание', value: true },
      { label: 'Бесплатное пополнение и снятие с карты', value: true },
      { label: 'Возможность выпуска виртуальной карты', value: true },
      { label: 'Платежная система', value: 'МИР' },
    ],
    advantages: [
      'Бесплатное годовое обслуживание',
      'Бесплатное пополнение и снятие с карты',
      'Возможность выпуска виртуальной карты',
    ],
    cardName: 'auto-drive',
    paymentSystems: ['mir'],
    filter: ['savings', 'cashback', 'mir'],
  },
  {
    id: 126439043570,
    rankForDisplay: 40,
    title: 'Активная карта',
    shortDescription: 'Карта для получения пенсий и социальных выплат',
    img: '/images/debitCards/active.jpg',
    tags: ['Накопления', 'Кешбэк', 'Социальная'],
    bonuses: [
      {
        title: 'Годовой процент на остаток в рублях',
        valueSmallText: 'до',
        valueBigText: ' 4,5%',
      },
      {
        title: 'Кешбэк от платежной системы «Мир»',
        valueSmallText: 'до',
        valueBigText: ' 20%',
      },
    ],
    keyConditions: [
      {
        title: 'Обслуживание при получении бюджетных выплат',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Cнятие\nналичных',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Годовой процент\nна остаток в рублях',
        valueSmallText: 'до',
        valueBigText: ' 4,5%',
      },
      {
        title: 'Кешбэк от платежной\nсистемы «Мир»',
        valueSmallText: 'до',
        valueBigText: ' 20%',
      },
    ],
    fullConditions: [
      { label: 'Годовой процент на остаток в рублях', value: 'до 4,5%' },
      { label: 'Кешбэк от платежной системы «Мир»', value: 'до 20%' },
      { label: 'Дополнительный кешбэк в категориях «Авто» и «Медицина»', value: true },
      { label: 'Бесплатное обслуживание при получении бюджетных выплат', value: true },
      { label: 'Бесплатное снятие наличных', value: true },
      { label: 'Платежная система', value: 'МИР' },
    ],
    advantages: [
      'Бесплатное обслуживание при получении бюджетных выплат',
      'Бесплатное снятие наличных',
      'Дополнительный кешбэк в категориях «Авто» и «Медицина»',
    ],
    cardName: 'active-social',
    paymentSystems: ['mir'],
    filter: ['savings', 'cashback', 'budget', 'mir'],
  },
  {
    id: 127554166329,
    rankForDisplay: 40,
    title: 'Активная карта',
    shortDescription: 'Карта с процентом на остаток и кешбэком в рублях',
    img: '/images/debitCards/active.jpg',
    tags: ['Накопления', 'Кешбэк'],
    bonuses: [
      {
        title: 'Годовой процент на остаток в рублях',
        valueSmallText: 'до',
        valueBigText: ' 4,5%',
      },
      {
        title: 'Кешбэк в категориях "Авто" и "Медицина"',
        valueSmallText: 'до',
        valueBigText: ' 3%',
      },
    ],
    keyConditions: [
      {
        title: 'Cнятие\n наличных',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Привилегии от платежной системы Mastercard',
        valueSmallText: '',
        valueBigText: 'Бесплатно',
      },
      {
        title: 'Годовой процент\nна остаток в рублях',
        valueSmallText: 'до',
        valueBigText: ' 4,5%',
      },
      {
        title: 'Кешбэк в категориях\n"Авто" и "Медицина"',
        valueSmallText: 'до',
        valueBigText: ' 3%',
      },
    ],
    fullConditions: [
      { label: 'Годовой процент на остаток в рублях', value: 'до 4,5%' },
      { label: 'Кешбэк в категориях "Авто" и "Медицина"', value: 'до 3%' },
      { label: 'Бесплатное снятие наличных', value: true },
      { label: 'Привилегии от платежной системы Mastercard', value: true },
      {
        label: 'Юридические услуги, дистанционные консультации с врачами-специалистами с пакетом "Активная жизнь"',
        value: true,
      },
      { label: 'Платежная система', value: 'MasterCard' },
    ],
    advantages: [
      'Бесплатное снятие наличных',
      'Привилегии от платежной системы Mastercard',
      'Юридические услуги, дистанционные консультации с врачами-специалистами с пакетом "Активная жизнь"',
    ],
    cardName: 'active-cashback',
    paymentSystems: ['mastercard'],
    filter: ['savings', 'cashback', 'mastercard'],
  },
];
