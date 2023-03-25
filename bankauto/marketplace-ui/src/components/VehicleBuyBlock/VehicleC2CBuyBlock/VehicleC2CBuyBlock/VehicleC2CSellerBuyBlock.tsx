import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import cx from 'classnames';
import {
  Grid,
  PriceFormat,
  Typography,
  useBreakpoints,
  Paper,
  Button,
  Box,
  CircularProgress,
  Divider,
} from '@marketplace/ui-kit';
import { PUBLICATION_CANCEL_REASON, VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { deactivateClientVehicle } from 'api';
import { useNotifications } from 'store/notifications';
import { OfferStatisticsContextProvider, OfferStatisticsButton } from 'containers/Sell/OfferStatisticsModal';
import { CancelReasonModal } from 'containers/Sell/CancelReasonModal/CancelReasonModal';
import { useStyles } from './VehicleC2CBuyBlock.styles';

type Props = {
  id: number | string;
  price: number;
  vehicleStatus: VEHICLE_STATUS;
};

export const VehicleC2CSellerBuyBlock: FC<Props> = memo(({ id, price, vehicleStatus }) => {
  const s = useStyles();
  const router = useRouter();
  const { isMobile } = useBreakpoints();
  const { notifyError, notify } = useNotifications();

  const [isDisabled, setIsDisabled] = useState<boolean>(
    !vehicleStatus || vehicleStatus !== VEHICLE_STATUS.CLIENT_DEACTIVATED ? false : true,
  );
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const handleEdit = useCallback(() => {
    setLoading(true);
    router.push('/sell/edit/[offerID]', `/sell/edit/${id}`);
  }, [id]);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleDeactivate = useCallback(
    (cancelReason: PUBLICATION_CANCEL_REASON) => {
      deactivateClientVehicle(id, cancelReason)
        .then(async () => {
          notify('Ваше объявление было снято с продажи. Вы можете повторно опубликовать его.');
          setIsDisabled(true);
          router.push('/profile/offers', '/profile/offers');
        })
        .catch((e) => {
          notifyError('Произошла ошибка при снятии объявления с публикации');
          console.log(e);
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [id],
  );

  return (
    <>
      <Grid container direction="column" spacing={0}>
        <Paper elevation={0} className={cx(!isMobile && s.bordered)}>
          <Box py={isMobile ? 0 : 2.5}>
            <Box px={isMobile ? 0 : 2.5}>
              <Typography variant={isMobile ? 'h3' : 'h2'} component="p">
                <PriceFormat value={+price} className={s.price} />
              </Typography>
            </Box>
          </Box>
        </Paper>
        {isMobile && (
          <Box mt={2.5}>
            <Divider />
          </Box>
        )}
        <Box mt={2.5}>
          <Button
            className={s.bookButton}
            fullWidth
            variant="contained"
            color="primary"
            size="large"
            onClick={handleEdit}
            disabled={loading}
          >
            <Typography variant="h5" component="span">
              Редактировать
            </Typography>
          </Button>
        </Box>
        <Box mt={2.5}>
          <Button
            className={s.bookButton}
            fullWidth
            variant="outlined"
            color="primary"
            size="large"
            onClick={handleOpenModal}
            disabled={loading || isDisabled}
          >
            {loading && (
              <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                <CircularProgress size="2rem" />
              </Box>
            )}
            <Typography variant="h5" component="span">
              Снять с публикации
            </Typography>
          </Button>
        </Box>
        <Box mt={2.5}>
          <OfferStatisticsContextProvider>
            <OfferStatisticsButton vehicleId={id} />
          </OfferStatisticsContextProvider>
        </Box>
      </Grid>
      <CancelReasonModal isOpen={isOpen} setIsOpen={setIsOpen} handleDeactivate={handleDeactivate} />
    </>
  );
});
