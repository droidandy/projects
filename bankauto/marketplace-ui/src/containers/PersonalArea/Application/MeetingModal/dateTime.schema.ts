import moment from 'moment';
import * as Yup from 'yup';
import { DATE } from 'constants/dateFormats';

const DateTimeSchema = Yup.object().shape({
  date: (Yup.string().nullable().required('Укажите дату') as any)
    .test('validDate', 'Укажите валидную дату', (date: string): boolean => moment(date, DATE).isValid())
    .test('futureDate', 'Дата не должна быть в прошлом', (date: string): boolean =>
      moment(date, DATE).isSameOrAfter(moment().startOf('day')),
    ),
  time: (Yup.string().nullable().required('Укажите время') as any).test(
    'valid time',
    'Укажите валидное время',
    (time: string): boolean => {
      if (!time) {
        return true;
      }
      const parts = time.split(':');
      const hour = Number(parts[0]);
      const minutes = Number(parts[1]);

      return hour >= 0 && hour < 24 && minutes >= 0 && minutes < 60;
    },
  ),
});

export { DateTimeSchema };
