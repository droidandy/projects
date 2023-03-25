import React, { FC, memo, useCallback, useState } from 'react';
import { useRouter } from 'next/router';
import { CreditSubtype, VehicleNew, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import {
  Grid,
  Paper,
  Button,
  Divider,
  Typography,
  PriceFormat,
  useBreakpoints,
  CircularProgress,
} from '@marketplace/ui-kit';
import { createC2cApplication } from 'api/application/createC2cApplication';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { ReportBlock } from 'containers/ReportBlock';
import { FavoritesButton } from 'containers/Favorites/FavoritesButton';
import { SellerInfoModal } from 'containers/Sell/SellerInfoModal';
import { CREDIT_PROGRAM_NAME } from 'constants/credit';
import { authModalTexts } from 'constants/authModalTexts';
import { useSellerModal } from './useSellerModal';
import { useAuthorizeWrapper } from 'hooks/useAuthorizeWrapper';
import { getCreditProgram } from 'helpers/credit';
import { useStyles } from './VehicleC2CBuyBlock.styles';

const INFO_DATA = [
  'Предоплата не требуется',
  'Одобрение кредита онлайн',
  'Данные продавца проверены',
  'Бесплатная юридическая проверка автомобиля',
  'Безопасная сделка в офисе РГС банка',
];

const infoJsx = INFO_DATA.map((text) => (
  <Typography variant="caption" component="p">
    • {text}
  </Typography>
));

const VehicleC2CCustomerBuyBlock: FC = memo(() => {
  const s = useStyles();
  const router = useRouter();
  const { isMobile } = useBreakpoints();
  const [creditBookingInProgress, setCreditBookingInProgress] = useState<boolean>(false);

  const { vehicle } = useVehicleItem() as { vehicle: VehicleNew };
  const { sellerInfo, sellerModalOpen, toggleOpenSellerModal } = useSellerModal(vehicle.id);
  const authorizeWrapper = useAuthorizeWrapper();

  const { price, id, contacts, city, type, autotekaReportTeaser } = vehicle;

  const creditBookingHandler = useCallback(() => {
    const creditProgram = getCreditProgram({
      programName: CREDIT_PROGRAM_NAME.C2C,
      vehiclePrice: price,
      creditAmount: price,
    });
    if (!creditProgram) {
      return;
    }
    setCreditBookingInProgress(true);
    createC2cApplication({
      vehicle_id: id,
      sales_office_id: 0,
      initial_payment: 0,
      amount: price,
      vehicle_cost: price,
      term: creditProgram.term.max,
      rate: creditProgram.rate,
      monthly_payment: 0,
      subtype: CreditSubtype.VEHICLE_C2C,
    })
      .then(({ data: { uuid } }) => {
        router.push(`/profile/c2c-credit/${uuid}`);
      })
      .finally(() => {
        setCreditBookingInProgress(false);
      });
  }, [price]);

  const handleCreditBooking = useCallback(() => {
    authorizeWrapper({
      regType: RegistrationTypes.CREDIT_VEHICLE_C2C,
      callback: creditBookingHandler,
    });
  }, [authorizeWrapper, creditBookingHandler]);

  const openSellerInfoModal = useCallback(() => {
    authorizeWrapper({
      regType: RegistrationTypes.C2C_PHONE_REQUEST,
      authModalTitle: authModalTexts[AuthSteps.AUTH].title,
      authModalText: authModalTexts[AuthSteps.AUTH].text,
      callback: toggleOpenSellerModal,
    });
  }, [authorizeWrapper, toggleOpenSellerModal]);

  const loading = creditBookingInProgress && !sellerModalOpen;

  return (
    <Grid container direction="column" spacing={0}>
      <Paper elevation={0} className={s.priceBlock}>
        <Typography variant={isMobile ? 'h3' : 'h2'} component="p">
          <PriceFormat value={+price} />
        </Typography>
        {isMobile && <FavoritesButton vehicleId={vehicle.id} />}
      </Paper>

      {isMobile && <Divider />}

      <div className={s.block}>
        <Button
          size="large"
          color="primary"
          variant="contained"
          disabled={loading}
          className={s.bookButton}
          onClick={handleCreditBooking}
          fullWidth
        >
          {loading && (
            <div className={s.buttonLoader}>
              <CircularProgress size="2rem" />
            </div>
          )}
          <Typography variant="h5" component="p">
            Получить одобрение на кредит
          </Typography>
          <Typography variant="caption">и связаться с продавцом</Typography>
        </Button>
      </div>

      <div className={s.block}>
        <Button
          size="large"
          color="primary"
          variant="outlined"
          className={s.bookButton}
          onClick={openSellerInfoModal}
          fullWidth
        >
          <Typography variant="h5" component="span">
            Связаться с продавцом
          </Typography>
        </Button>
      </div>

      <div className={s.info}>{infoJsx}</div>

      {type === VEHICLE_TYPE.USED && (
        <div className={s.block}>
          <ReportBlock id={id} autotekaReportTeaser={autotekaReportTeaser} />
        </div>
      )}

      <SellerInfoModal
        city={city.name}
        isOpen={sellerModalOpen}
        contacts={contacts}
        sellerInfo={sellerInfo}
        buttonDisabled={creditBookingInProgress}
        toggleOpen={toggleOpenSellerModal}
        creditBookingHandler={creditBookingHandler}
      />
    </Grid>
  );
});

export { VehicleC2CCustomerBuyBlock };
