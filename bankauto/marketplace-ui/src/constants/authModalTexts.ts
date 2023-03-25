import { AuthSteps } from 'types/Authentication';

export const authModalTexts = {
  [AuthSteps.DEFAULT]: {
    title: 'Авторизация',
    text: 'Укажите номер своего телефона, \nчтобы войти или зарегистрироваться.',
  },
  [AuthSteps.AUTH]: {
    title: 'Остался один шаг',
    text: 'Для продолжения бронирования\n укажите, пожалуйста, номер вашего телефона',
  },
  [AuthSteps.PHONE_CONFIRMATION]: {
    title: 'Авторизация',
    text: 'Подтвердите указанный номер \nс помощью SMS-кода.',
  },
  [AuthSteps.REGISTRATION]: {
    title: 'Завершение регистрации.',
    text: '',
  },
  [AuthSteps.SUGGEST]: {
    title: '',
    text: 'Вы уже использовали сервис #банкавто.\nПожалуйста, подтвердите номер \nтелефона, чтобы получить лучшее \nпредложение от банка',
  },
  [AuthSteps.FAVOURITES]: {
    title: 'Авторизация',
    text: 'Для добавления автомобиля в избранное \nнеобходимо авторизоваться',
  },
  [AuthSteps.COMPARISON]: {
    title: 'Авторизация',
    text: 'Для сравнения автомобилей \nнеобходимо авторизоваться',
  },
  [AuthSteps.TEST_DRIVE]: {
    title: 'Авторизация',
    text: 'Для отправки заявки на тест–драйв \nнеобходимо авторизоваться',
  },
};
