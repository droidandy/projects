import * as Yup from 'yup';
import { checkIsPhoneCodeCorrect } from 'helpers/validations/phone';

export const SmsFormSchema = Yup.object().shape({
  phone: (Yup.string().nullable().required('Укажите телефон') as any)
    .length(12, 'Некорректный формат телефона')
    .test('isValid', 'Укажите корректный код оператора', (phoneNumber: string): boolean =>
      phoneNumber ? checkIsPhoneCodeCorrect(phoneNumber) : false,
    ),
});
