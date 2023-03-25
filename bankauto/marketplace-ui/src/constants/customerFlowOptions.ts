import { ReactComponent as AutoIcon } from '@marketplace/ui-kit/icons/iconAuto.svg';
import { ReactComponent as AutoCalendar } from '@marketplace/ui-kit/icons/iconCalendar.svg';
import { ReactComponent as AutoDocs } from '@marketplace/ui-kit/icons/iconDocs.svg';
import { ReactComponent as AutoHold } from '@marketplace/ui-kit/icons/iconHold.svg';
import { ReactComponent as AutoTerms } from '@marketplace/ui-kit/icons/iconTerms.svg';
import { ReactComponent as InsMoney } from '@marketplace/ui-kit/icons/iconMoney.svg';
import { ReactComponent as InsPrice } from '@marketplace/ui-kit/icons/iconPrice.svg';
import { ReactComponent as Request } from '@marketplace/ui-kit/icons/iconRequest.svg';
import { ReactComponent as CreditDecision } from '@marketplace/ui-kit/icons/iconDecision.svg';
import { ReactComponent as CreditCoin } from '@marketplace/ui-kit/icons/iconCoin.svg';
import { ReactComponent as PhoneCall } from 'icons/iconPhoneCall.svg';
import { ReactComponent as Document } from 'icons/Document.svg';
import { ReactComponent as IconForm } from 'icons/iconFormDark.svg';
import { ReactComponent as CreditCard } from 'icons/CreditCard.svg';
import { ReactComponent as CreditCardSelected } from 'icons/CreditCardSelected.svg';
import { ReactComponent as Money } from 'icons/Money.svg';
import { ReactComponent as NotePencil } from 'icons/NotePencil.svg';
import { ReactComponent as Car } from 'icons/Car.svg';
import { ReactComponent as Key } from 'icons/Key.svg';
import { ReactComponent as IconLocation } from 'icons/iconLocation48.svg';
import { ReactComponent as IconFileText } from 'icons/iconFileText.svg';

export enum CustomerFlowName {
  PURCHASE_FLOW_OPTIONS = 'purchaseFlowOptions',
  CREDIT_FLOW_OPTIONS = 'creditFlowOptions',
  INSURANCE_FLOW_OPTIONS = 'insuranceFlowOptions',
  SELL_FLOW_OPTIONS = 'sellFlowOptions',
  DEPOSIT_FLOW_OPTIONS = 'depositFlowOptions',
  /** Просто деньги */
  FINANCE_STANDALONE_CREDIT = 'financeStandaloneCredit',
  /** Кредит на покупку нового авто и Кредит на покупку АСП у диллера */
  FINANCE_STANDALONE_AUTO_CREDIT = 'financeStandaloneAutoCredit',
  /** С2С c безопасной сделкой */
  FINANCE_CREDIT_C2C_SAFE_DEAL = 'financeCreditC2CsafeDeal',
  /** Дебетовая карта. Как получить */
  DEBIT_CARD_HOW_GET_CARD = 'debitCardHowGetCard',
  /** Накопительный счет «Автомобилист» */
  SAVINGS_ACCOUNT_OPTIONS = 'savingsAccountFlowOptions',
}

export const CUSTOMER_FLOW_MAP = {
  [CustomerFlowName.PURCHASE_FLOW_OPTIONS]: {
    isShortOptionsList: false,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    sectionHow: {
      text: 'Узнайте, как купить онлайн',
    },
    options: [
      {
        id: 1,
        icon: AutoIcon,
        title: 'Найдите\n автомобиль\n в каталоге',
        altTitle: 'Выберите автомобиль',
        showArrow: true,
      },
      {
        id: 2,
        icon: AutoHold,
        title: 'Забронируйте понравившийся\n вариант онлайн',
        altTitle: 'Зарегистрируйтесь и забронируйте автомобиль',
        showArrow: true,
      },
      {
        id: 3,
        icon: AutoTerms,
        title: 'Выберите\n условия\n покупки',
        altTitle: 'Найдите и рассчитайте подходящие для вас условия покупки в кредит и трейд-ин',
        showArrow: true,
      },
      {
        id: 4,
        icon: AutoCalendar,
        title: 'Посетите автосалон\n в назначенную\n дату',
        altTitle: 'Дилер свяжется с вами для назначения даты сделки',
        showArrow: true,
      },
      {
        id: 5,
        icon: AutoDocs,
        title: 'Оплатите остаток\n и автомобиль — ваш!',
        altTitle: 'Заберите ваш автомобиль в дилерском центре',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.CREDIT_FLOW_OPTIONS]: {
    isShortOptionsList: true,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2 },
    sectionHow: {
      text: 'Узнайте, как купить онлайн',
    },
    options: [
      {
        id: 1,
        icon: Request,
        title: 'Заполните\n заявку',
        showArrow: true,
      },
      {
        id: 2,
        icon: CreditDecision,
        title: 'Получите\n одобрение',
        showArrow: true,
      },
      {
        id: 3,
        icon: CreditCoin,
        title: 'Воспользуйтесь\n деньгами',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.INSURANCE_FLOW_OPTIONS]: {
    isShortOptionsList: true,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2 },
    sectionHow: {
      text: 'Узнайте, как купить онлайн',
    },
    options: [
      {
        id: 1,
        icon: Request,
        title: 'Заполните\n анкету',
        showArrow: true,
      },
      {
        id: 2,
        icon: InsPrice,
        title: 'Узнайте\n стоимость',
        showArrow: true,
      },
      {
        id: 3,
        icon: InsMoney,
        title: 'Оплатите\n онлайн',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.SELL_FLOW_OPTIONS]: {
    isShortOptionsList: false,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    sectionHow: {
      text: 'Узнайте, как продать онлайн',
    },
    options: [
      {
        id: 1,
        icon: AutoIcon,
        title: 'Найдите\n автомобиль\n в каталоге',
        showArrow: true,
      },
      {
        id: 2,
        icon: AutoTerms,
        title: 'Выберите\n условия\n покупки',
        showArrow: true,
      },
      {
        id: 3,
        icon: AutoHold,
        title: 'Забронируйте понравившийся\n вариант онлайн',
        showArrow: true,
      },
      {
        id: 4,
        icon: AutoCalendar,
        title: 'Посетите автосалон\n в назначенную\n дату',
        showArrow: true,
      },
      {
        id: 5,
        icon: AutoDocs,
        title: 'Оплатите остаток\n и автомобиль — ваш!',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.DEPOSIT_FLOW_OPTIONS]: {
    isShortOptionsList: true,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: NotePencil,
        title: 'Заполните заявку',
        showArrow: true,
        subtitle: 'Получите смс с промокодом для повышения ставки',
      },
      {
        id: 2,
        icon: PhoneCall,
        title: 'Сотрудник банка свяжется с вами',
        showArrow: true,
        subtitle: 'Закажите доставку курьером или подберите отделение',
      },
      {
        id: 3,
        icon: CreditCard,
        title: 'Откройте вклад',
        showArrow: false,
        subtitle: 'Пополняйте онлайн или в банкоматах',
      },
    ],
  },
  [CustomerFlowName.SAVINGS_ACCOUNT_OPTIONS]: {
    isShortOptionsList: true,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: NotePencil,
        title: 'Введите необходимые данные',
        showArrow: true,
        subtitle: 'в короткую форму\n и нажмите "Отправить заявку"',
      },
      {
        id: 2,
        icon: PhoneCall,
        title: 'Сотрудник банка свяжется с вами',
        showArrow: true,
        subtitle: 'Закажите доставку курьером или подберите отделение',
      },
      {
        id: 3,
        icon: CreditCard,
        title: 'Откройте счет',
        showArrow: false,
        subtitle: 'Пополняйте онлайн или в банкоматах',
      },
    ],
  },
  [CustomerFlowName.FINANCE_STANDALONE_CREDIT]: {
    isShortOptionsList: false,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: NotePencil,
        title: 'Заполните заявку\n на сайте',
        showArrow: true,
      },
      {
        id: 2,
        icon: IconForm,
        title: 'Получите решение\n за 15 минут в режиме\n онлайн',
        showArrow: true,
      },
      {
        id: 3,
        icon: IconLocation,
        title: 'Приезжайте в офис банка\n или вызовите курьера',
        showArrow: true,
      },
      {
        id: 4,
        icon: CreditCard,
        title: 'Получите кредит на\nбесплатную дебетовую карту',
        showArrow: true,
      },
      {
        id: 5,
        icon: Money,
        title: 'Оплачивайте покупки или\n снимите наличные без\n комиссии',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.FINANCE_STANDALONE_AUTO_CREDIT]: {
    isShortOptionsList: false,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: NotePencil,
        title: 'Заполните заявку\n на сайте',
        showArrow: true,
      },
      {
        id: 2,
        icon: IconForm,
        title: 'Получите решение\n за 15 минут в режиме\n онлайн',
        showArrow: true,
      },
      {
        id: 3,
        icon: Document,
        title: 'Приезжайте в офис банка с документами в любое удобное время',
        showArrow: true,
      },
      {
        id: 4,
        icon: CreditCard,
        title: 'Получите кредит\n в день обращения\n на бесплатную дебетовую карту',
        showArrow: true,
      },
      {
        id: 5,
        icon: Money,
        title: 'Оплачивайте покупку автомобиля картой или снимите наличные без комиссии',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.FINANCE_CREDIT_C2C_SAFE_DEAL]: {
    isShortOptionsList: false,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: NotePencil,
        title: 'Заполните онлайн-заявку и получите сертификат об одобрении кредита',
        showArrow: true,
      },
      {
        id: 2,
        icon: Car,
        title: 'Выберите понравившийся автомобиль и приезжайте с продавцом в отделение банка',
        showArrow: true,
      },
      {
        id: 3,
        icon: IconForm,
        title: 'Эксперт банка проверяет юридическую чистоту автомобиля и готовит комплект документов',
        showArrow: true,
      },
      {
        id: 4,
        icon: IconFileText,
        title: 'Подпишите договор, а банк гарантирует быстрое и безопасное перечисление средств',
        showArrow: true,
      },
      {
        id: 5,
        icon: Key,
        title: 'Станьте владельцем\n автомобиля, о котором\n давно мечтали',
        showArrow: false,
      },
    ],
  },
  [CustomerFlowName.DEBIT_CARD_HOW_GET_CARD]: {
    isShortOptionsList: true,
    breakpoints: { xl: 2, lg: 2, md: 2, sm: 2, xs: 2 },
    options: [
      {
        id: 1,
        icon: CreditCardSelected,
        title: 'Заполните заявку онлайн',
        subtitle: 'Мы перезвоним и подробно\n проконсультируем',
        showArrow: true,
      },
      {
        id: 2,
        icon: PhoneCall,
        title: 'Договоримся о доставке',
        subtitle: 'Выпустим виртуальную карту\n или доставим обычную',
        showArrow: true,
      },
      {
        id: 3,
        icon: CreditCard,
        title: 'Получите карту',
        subtitle: 'И сразу начинайте\n получать преимущества',
        showArrow: false,
      },
    ],
  },
};
