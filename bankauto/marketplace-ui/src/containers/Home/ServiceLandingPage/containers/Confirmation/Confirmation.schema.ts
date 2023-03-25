import * as Yup from 'yup';
import { checkIsPhoneCodeCorrect } from 'helpers/validations/phone';

export const ConfirmationSchema = Yup.object().shape({
  phone: (Yup.string().nullable().required('Укажите телефон') as any)
    .length(12, 'Некорректный формат телефона')
    .test('isValid', 'Укажите корректный код оператора', (phoneNumber: string): boolean =>
      phoneNumber ? checkIsPhoneCodeCorrect(phoneNumber) : false,
    ),
  firstName: Yup.string().nullable().required('Укажите имя') as any,
  email: (Yup.string().nullable().required('Укажите email') as any).email(
    'Электронная почта должна быть действительной',
  ),
  istermsOfUseService: Yup.boolean().oneOf([true], 'Поле необходимо отметить') as any,
  // isReceiveServiceOffers: (Yup.boolean().oneOf([true], 'Поле необходимо отметить') as any),
});
