import React, { useCallback, useMemo } from 'react';
import { Collapse, DefaultCollapseHeader } from 'components/Collapse';
import { APPLICATION_VEHICLE_STATUS, PriceFormat } from '@marketplace/ui-kit';
import { Controls } from 'components/Collapse/Collapse';
import { Color } from 'constants/Color';
import { BookingContainerContent } from './BookingContainerContent';
import { useApplication } from 'store/profile/application';

export const BookingContainer = () => {
  const {
    vehicle: { data, status, paymentDate, refundDate },
    cancelHolding,
  } = useApplication();
  const isBooked = status === APPLICATION_VEHICLE_STATUS.BOOKED;
  const prepayment: number = useMemo(() => (data && data.bookingPrice) || 0, [data]);
  const isPayed = paymentDate && !refundDate;
  const isBookingProcess = useMemo(
    () => status === APPLICATION_VEHICLE_STATUS.BOOKED || status === APPLICATION_VEHICLE_STATUS.PAYMENT,
    [status],
  );

  const handleCancelHolding = useCallback(() => {
    cancelHolding();
  }, [cancelHolding]);

  const header = useCallback(
    ({ toggleExpanded, isExpanded }: Controls) => (
      <DefaultCollapseHeader
        digit={{
          value: 1,
          circleColor: isBooked ? (isPayed ? Color.GREEN : Color.YELLOW) : Color.GRAY,
        }}
        main={{
          title: 'Бронирование',
          subtitle: isExpanded
            ? undefined
            : isBookingProcess
            ? {
                value: isPayed ? 'Автомобиль забронирован' : 'Забронировать',
                color: isPayed ? Color.GREEN : Color.RED,
                helperText: isPayed ? 'Отменить' : 'Необязательно',
                helperTextColor: isPayed ? Color.RED : Color.GRAY,
                onClick: toggleExpanded,
                onHelperClick: isPayed ? handleCancelHolding : toggleExpanded,
              }
            : status === APPLICATION_VEHICLE_STATUS.CANCEL
            ? { value: 'Бронирование отменено' }
            : status === APPLICATION_VEHICLE_STATUS.FROZEN && isPayed
            ? { value: 'Автомобиль забронирован', color: Color.GREEN }
            : undefined,
        }}
        additional={{
          title:
            prepayment && isBookingProcess ? (
              <span style={{ textDecoration: isBooked && !isPayed ? 'line-through' : 'auto' }}>
                Предоплата <PriceFormat value={prepayment} /> {isPayed ? 'внесена' : ''}
              </span>
            ) : status === APPLICATION_VEHICLE_STATUS.CANCEL && isPayed ? (
              <span>Предоплата возвращена</span>
            ) : null,
        }}
      />
    ),
    [isBooked, isPayed, prepayment, status],
  );

  return (
    <Collapse header={header} expanded={!isBooked} isCollapsed={!isBookingProcess} disabled={!isBookingProcess}>
      {({ setClosed }) => (
        <BookingContainerContent
          onSkipPayment={() => {
            setClosed();
          }}
        />
      )}
    </Collapse>
  );
};
