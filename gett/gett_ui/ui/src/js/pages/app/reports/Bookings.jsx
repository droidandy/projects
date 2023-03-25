import { BookingsList } from 'pages/app/bookings';
import { finalStatuses } from 'pages/shared/bookings/data';

export default class Bookings extends BookingsList {
  static defaultProps = {
    defaultStatuses: finalStatuses,
    emptyText: 'You haven\'t got any bookings.'
  };
}
