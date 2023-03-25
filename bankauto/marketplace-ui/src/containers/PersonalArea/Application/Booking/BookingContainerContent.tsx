import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { List, ListItem } from '@material-ui/core';
import { APPLICATION_VEHICLE_STATUS, Box, Button, PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as CarBlackIcon } from 'icons/CarBlack.svg';
import { ReactComponent as ShieldCheckIcon } from 'icons/ShieldCheck.svg';
import { ReactComponent as WalletIcon } from 'icons/Wallet.svg';
import { ReactComponent as CalendarXIcon } from 'icons/CalendarX.svg';
import { ReactComponent as UserIcon } from 'icons/User.svg';
import { makeStyles } from '@material-ui/core/styles';
import { useApplication } from 'store/profile/application';
import { syncOrderPayment } from 'api/application/order/syncOrderPayment';
import { BookingContainerContentProps } from './types';
import { BookingSuccessModal } from '../BookingSuccessModal/BookingSuccessModal';
import { useRouter } from 'next/router';
import { BookingFailModal } from '../BookingFailModal/BookingFailModal';

const WithoutBookingBenefits = () => {
  return (
    <Box mt={1}>
      <Typography variant="subtitle2" component="p">
        • Автомобиль может приобрести другой покупатель
      </Typography>
      <Typography variant="subtitle2" component="p">
        • Скидки и цена не фиксируются и могут измениться
      </Typography>
    </Box>
  );
};

const WithBookingBenefits = () => {
  return (
    <Box mt={1}>
      <Typography variant="subtitle2" component="p">
        Нажав кнопку «Забронировать онлайн», вы перейдете на страницу платежной системы для завершения бронирования.
      </Typography>
    </Box>
  );
};

const list = [
  {
    title: 'Автомобиль будет зарезервирован на 3 дня',
    icon: <CarBlackIcon width={36} height={36} />,
  },
  {
    title: 'Предоплата фиксирует цену автомобиля, все скидки и условия',
    icon: <ShieldCheckIcon width={36} height={36} />,
  },
  {
    title: 'Моментальный возврат предоплаты, в случае отказа от бронирования',
    icon: <WalletIcon width={36} height={36} />,
  },
  {
    title: 'Отказаться от сделки можно в любое время',
    icon: <CalendarXIcon width={36} height={36} />,
  },
  {
    title: 'Персональный менеджер поможет заполнить анкету на трейд-ин и кредит',
    icon: <UserIcon width={36} height={36} />,
  },
];

const useStyles = makeStyles(
  ({
    palette: {
      primary: { main },
    },
  }) => ({
    listItem: {
      display: 'flex',
      alignItems: 'center',
    },
    listItemText: {
      marginLeft: '2rem',
    },
    containedButton: {
      paddingTop: '0.5rem',
      paddingBottom: '0.5rem',
      height: 60,
      border: `2px solid ${main}`,
    },
    outlinedButton: {
      height: 60,
    },
  }),
  {
    name: 'BookingContainerContent',
  },
);

export const BookingContainerContent = ({ onSkipPayment }: BookingContainerContentProps) => {
  const classes = useStyles();
  const { isMobile } = useBreakpoints();

  const {
    vehicle: { data, id: vehicleApplicationId, status, paymentDate },
    container: { uuid: applicationUuid },
    fetchApplication,
    confirmApplication,
    payForOrder,
  } = useApplication();

  const prepayment: number = useMemo(() => (data && data.bookingPrice) || 0, [data]);
  const isBooked: boolean = useMemo(() => status === APPLICATION_VEHICLE_STATUS.BOOKED, [status]);
  const vehicleId: number = useMemo(() => (data && data.id) || 0, [data]);

  const [isBookingSuccessModalOpen, setBookingSuccessModalOpen] = useState(false);
  const [isBookingFailModalOpen, setBookingFailModalOpen] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState<boolean>(false);
  const [shouldClearStatus, setShouldClearStatus] = useState<boolean>(false);

  /**
   * Sync payment status on page open
   */
  useEffect(() => {
    if (vehicleId && status === APPLICATION_VEHICLE_STATUS.PAYMENT) {
      setSyncInProgress(true);
      syncOrderPayment(vehicleId)
        .then(({ vehicle: { status } }) => {
          if (status === APPLICATION_VEHICLE_STATUS.BOOKED) {
            fetchApplication(applicationUuid, true);
          }
        })
        .catch()
        .finally(() => setSyncInProgress(true));
    }
  }, [vehicleId, status]);

  const { query, push, pathname } = useRouter();

  // Показываем модальные окна результатов оплаты
  useEffect(() => {
    if (query.status === 'fail') {
      setBookingFailModalOpen(true);
    }

    if (query.status === 'success') {
      setBookingSuccessModalOpen(true);
    }
  }, [query, setBookingSuccessModalOpen, setBookingFailModalOpen]);

  useEffect(() => {
    if (!syncInProgress && shouldClearStatus) {
      handleClearPaymentStatus();
    }
  }, [syncInProgress, shouldClearStatus]);

  const handleClearPaymentStatus = useCallback(() => {
    if (query.status) {
      if (syncInProgress) {
        setShouldClearStatus(true);
        return;
      }

      const newPathQuery = {
        ...query,
      };
      delete newPathQuery.status;

      const newUrlParamsQuery = {
        ...newPathQuery,
      };
      delete newUrlParamsQuery.applicationId;

      push(
        { pathname: window.location.pathname, query: newPathQuery },
        `/profile/applications/${query.applicationId}?${new URLSearchParams(
          newUrlParamsQuery as Record<string, string>,
        ).toString()}`,
        { shallow: true },
      );
    }
  }, [query, syncInProgress, setShouldClearStatus]);

  const handleSetIsFailModalOpen = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleClearPaymentStatus();
      }

      setBookingFailModalOpen(isOpen);
    },
    [handleClearPaymentStatus, setBookingFailModalOpen],
  );

  const handleSetIsSuccessModalOpen = useCallback(
    (isOpen: boolean) => {
      if (!isOpen) {
        handleClearPaymentStatus();
      }

      setBookingSuccessModalOpen(isOpen);
    },
    [handleClearPaymentStatus, setBookingSuccessModalOpen],
  );

  const handlePay = useCallback(() => {
    return (payForOrder() as unknown as Promise<{ hold_url: string }>).then(({ hold_url }) => {
      window.location.href = hold_url;
    });
  }, []);

  const handleRetryPay = useCallback(() => {
    return handlePay().then(() => setBookingFailModalOpen(false));
  }, [handlePay, setBookingFailModalOpen]);

  /**
   * Skip payment handler.
   */
  const handleSkipPayment = useCallback(() => {
    (confirmApplication() as unknown as Promise<void>).then(() => onSkipPayment());
  }, [confirmApplication, onSkipPayment]);

  return (
    <Box maxWidth="100%">
      <List disablePadding>
        {list.map(({ title, icon }) => (
          <ListItem disableGutters className={classes.listItem}>
            {icon}{' '}
            <Typography variant="body1" className={classes.listItemText}>
              {title}
            </Typography>
          </ListItem>
        ))}
      </List>
      {paymentDate ||
      (status !== APPLICATION_VEHICLE_STATUS.BOOKED && status !== APPLICATION_VEHICLE_STATUS.PAYMENT) ? null : (
        <Box display="flex" mt={isMobile ? '1rem' : '2rem'} flexDirection={isMobile ? 'column' : 'row'}>
          <Box mr={isMobile ? 0 : '2rem'} width={isMobile ? '100%' : '40%'}>
            <Button
              className={classes.containedButton}
              variant="contained"
              color="primary"
              onClick={handlePay}
              fullWidth
            >
              <div>
                <Typography variant="h5" style={{ lineHeight: '1rem' }}>
                  Забронировать онлайн
                </Typography>
                {prepayment && (
                  <Typography variant="caption">
                    Предоплата&nbsp;
                    <PriceFormat value={prepayment} />
                  </Typography>
                )}
              </div>
            </Button>
            <WithBookingBenefits />
          </Box>
          <Box mt={isMobile ? '2rem' : 0} width={isMobile ? '100%' : '40%'}>
            <Button
              onClick={handleSkipPayment}
              color="primary"
              variant="outlined"
              fullWidth
              disabled={isBooked}
              className={classes.outlinedButton}
            >
              <Typography variant="h5">Продолжить без бронирования</Typography>
            </Button>
            <WithoutBookingBenefits />
          </Box>
        </Box>
      )}
      <BookingSuccessModal isOpen={isBookingSuccessModalOpen} setIsOpen={handleSetIsSuccessModalOpen} />
      <BookingFailModal isOpen={isBookingFailModalOpen} setIsOpen={handleSetIsFailModalOpen} onRetry={handleRetryPay} />
    </Box>
  );
};
