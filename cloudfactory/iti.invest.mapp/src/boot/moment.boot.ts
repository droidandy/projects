import moment from 'moment';
import 'moment/locale/ru';
moment.updateLocale('ru', {
  relativeTime: {
    MM: '%d мес.',
  } as any,
});
