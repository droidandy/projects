import update from 'update-js';
import bookings from '../app/bookings.reducer';

export default bookings.update((reducer) => {
  reducer('removeBookingFromList', (state, id) => {
    return update.remove(state, `list.items.{id:${id}}`);
  });

  reducer('cancelBookingSuccess', (state, { id, booking }) => {
    return update(state, `list.items.{id:${id}}`, booking);
  });

  reducer('getCreatedBookingSuccess', (state, booking) => {
    return update.with(state, 'list.items', items => [booking, ...items]);
  });

  reducer('getUpdatedBookingSuccess', (state, booking) => {
    return update(state, `list.items.{id:${booking.id}}`, booking);
  });

  reducer('getFormDataSuccess', (state, formData) => {
    return { ...state, formData };
  });
});
