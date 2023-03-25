import './init-config';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import duration from 'dayjs/plugin/duration';
import relativeTime from 'dayjs/plugin/relativeTime';
import '../queue/queue';
import '../queue/bull-arena';

dayjs.extend(utc);
dayjs.extend(duration);
dayjs.extend(relativeTime);
