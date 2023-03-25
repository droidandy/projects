import React, { FC, memo, useState, useEffect, useMemo } from 'react';
import cx from 'classnames';
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  Grid,
  Paper,
  PriceFormat,
  Typography,
  useBreakpoints,
} from '@marketplace/ui-kit';
import { useDispatch } from 'react-redux';
import { useInstalmentOffer } from 'store/instalment/vehicle/item';
import { useInstalmentFilter } from 'store/instalment/vehicles/filter';
import { createInstalmentApplication } from 'api/application/instalment';
import { Pending } from 'helpers/pendings';
import { actions as userActions } from 'store/user';
import { unauthorizedGuard } from 'guards';
import { authModalTexts } from 'constants/authModalTexts';
import { useRouter } from 'next/router';
import { fireInstallmentBookingAnalytics } from 'helpers/analytics';
import { MessageModalName } from 'types/MessageModal';
import { ReportBlock } from 'containers/ReportBlock';
import { APPLICATION_TYPE, CreditSubtype, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { pluralizeMonth } from 'constants/pluralizeConstants';
import { ContactsList } from 'components/ContactsList';
import { useStyles } from './VehicleBuyBlock.styles';
import { CreateInstalmentApplicationParamsDTO } from 'dtos/CreateInstalmentApplicationParamsDTO';

const DEFAULT_TERM = 60;

export const BuyBlockContainer: FC = memo(() => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { vehicle } = useInstalmentOffer();
  const { values } = useInstalmentFilter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const { push } = useRouter();
  const [selectedMonth, setSelectedMonths] = React.useState<number>(
    vehicle?.specialOffer?.installmentTerm ?? DEFAULT_TERM,
  );
  const isSpecialOffer = vehicle?.specialOffer !== null;
  useEffect(() => {
    if (vehicle && values.installmentMonths) {
      setSelectedMonths(+values.installmentMonths);
    }
  }, [vehicle, values]);

  const paymentsItems = useMemo(
    () => (vehicle?.installmentPayments ? Object.entries(vehicle.installmentPayments) : null),
    [vehicle],
  );

  const getPaymentsList = useMemo(() => {
    if (!paymentsItems) {
      return null;
    }
    return paymentsItems.map((item) => (
      <Box
        key={item[0]}
        className={selectedMonth === +item[0] ? cx(s.chip, s.chipSelected) : s.chip}
        onClick={() => setSelectedMonths(+item[0])}
        mr={1.25}
        bgcolor={selectedMonth === +item[0] ? 'primary.main' : 'common.white'}
        px={1.5}
        py={0.25}
      >
        <Typography component="span" variant={selectedMonth === +item[0] ? 'h6' : 'body2'} className={s.chipText}>
          {item[0]}
        </Typography>
      </Box>
    ));
  }, [paymentsItems, selectedMonth]);

  if (!vehicle || !paymentsItems) {
    return null;
  }

  const handleCreateApplication = (application: CreateInstalmentApplicationParamsDTO) => {
    setLoading(true);
    dispatch(userActions.setCallbackApplicationParams({ applicationParams: application }));
    unauthorizedGuard(
      `/create-application?type=${APPLICATION_TYPE.INSTALMENT}`,
      authModalTexts[AuthSteps.AUTH].title,
      authModalTexts[AuthSteps.AUTH].text,
      vehicle.type === VEHICLE_TYPE.NEW
        ? RegistrationTypes.VEHICLE_INSTALLMENT_NEW
        : RegistrationTypes.VEHICLE_INSTALLMENT_USED,
    )
      .then(() => Pending('create-application', createInstalmentApplication(application)))
      .then(({ data }) => {
        fireInstallmentBookingAnalytics(data);
        push(
          `/profile/installment/${(data as any).uuid}?modal=${
            MessageModalName.APPLICATION_INSTALMENT_CREATED
          }&buttonTitle=Продолжить`,
        );
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setLoading(false);
      });
  };

  const handleBooking = () => {
    const vehicleAmount = vehicle.specialOffer
      ? Math.ceil(vehicle.price - (vehicle.price * vehicle.specialOffer.dealerDiscount) / 100)
      : vehicle.price;
    const instalmentInitialPayment = vehicle.specialOffer
      ? Math.ceil(((vehicle.specialOffer?.installmentInitialPaymentPercent ?? 0) / 100) * vehicleAmount)
      : 0;

    const params: CreateInstalmentApplicationParamsDTO = {
      vehicle_id: vehicle.id,
      sales_office_id: 0,
      initial_payment: instalmentInitialPayment,
      initial_payment_percent: vehicle.specialOffer?.installmentInitialPaymentPercent,
      monthly_payment: isSpecialOffer ? vehicle.installmentPayment : vehicle.installmentPayments[selectedMonth],
      term: selectedMonth,
      amount: vehicleAmount,
      vehicle_cost: vehicle.price,
      rate: 0,
      subtype: CreditSubtype.VEHICLE_INSTALLMENT,
      special_offer: isSpecialOffer
        ? {
            id: vehicle.specialOffer?.id as number,
            percent: vehicle.specialOffer?.percent as number,
            name: vehicle.specialOffer?.name as string,
            alias: vehicle.specialOffer?.alias,
            link: vehicle.specialOffer?.link,
            vehicle_type: vehicle.specialOffer?.vehicleType,
            application_type: vehicle.specialOffer?.applicationType || null,
            dealer_discount: vehicle.specialOffer?.dealerDiscount || null,
          }
        : null,
    };
    handleCreateApplication(params);
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Paper elevation={0} className={cx(!isMobile && s.bordered)}>
        <Box p={2.5}>
          <Box>
            <Typography variant={isMobile ? 'h6' : 'h5'} component="span" color="primary">
              Первоначальный взнос {isSpecialOffer ? vehicle?.specialOffer?.installmentInitialPaymentPercent : '0'}%
            </Typography>
            {isSpecialOffer && (
              <Typography variant={isMobile ? 'h6' : 'h5'} component="div" color="textSecondary">
                Полная стоимость <PriceFormat value={vehicle.priceWithoutDiscounts} />
              </Typography>
            )}
          </Box>
          <Grid container alignItems="center">
            <Grid item>
              <Box>
                <Typography variant={isMobile ? 'h3' : 'h2'} color="textPrimary" component="span">
                  <PriceFormat
                    value={
                      isSpecialOffer ? vehicle.installmentPayment : vehicle.installmentPayments[selectedMonth] || 0
                    }
                  />
                  /месяц
                </Typography>
              </Box>
            </Grid>
            {/* <Grid item>
              <InfoTooltip
                title={
                  <Typography variant="body2" style={{ color: 'white' }}>
                    Пока нет инфы
                  </Typography>
                }
              />
            </Grid> */}
          </Grid>
          <Box py={1.25}>
            <Typography variant="h5" component="span">
              Срок рассрочки
              {isSpecialOffer
                ? ` ${vehicle.specialOffer?.installmentTerm} ${pluralizeMonth(
                    vehicle.specialOffer?.installmentTerm || 60,
                  )}`
                : ', мес'}
            </Typography>
          </Box>
          {!isSpecialOffer && (
            <Box display="flex" flexDirection="row">
              {getPaymentsList}
            </Box>
          )}
        </Box>
      </Paper>
      <Box px={isMobile ? 2.5 : 0}>
        {isMobile && <Divider />}
        <Box mt={2.5}>
          <Button
            className={s.bookButton}
            fullWidth
            type="submit"
            variant="contained"
            color="primary"
            size="large"
            onClick={handleBooking}
            disabled={loading}
          >
            {loading && (
              <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                <CircularProgress size="2rem" />
              </Box>
            )}
            <b>Забронировать онлайн</b>
            <br />
            <Typography variant="caption">
              в рассрочку от&nbsp;
              <PriceFormat
                value={isSpecialOffer ? vehicle.installmentPayment : vehicle.installmentPayments[selectedMonth] || 0}
              />
              /мес
            </Typography>
          </Button>
          <div>
            {!isSpecialOffer && (
              <>
                <div className={s.contactContainer}>
                  <ContactsList />
                </div>
              </>
            )}
          </div>
          <Box pt={1.25} mt={isMobile ? 0 : 2.5} mb={2.5}>
            <Typography variant="body2" component="div">
              • Предоплата не требуется
            </Typography>
            <Typography variant="body2" component="div">
              • Условия и скидки фиксируются
            </Typography>
            <Typography variant="body2" component="div">
              • Одобрение рассрочки онлайн
            </Typography>
            <Typography variant="body2" component="div">
              • Персональный менеджер
            </Typography>
          </Box>
        </Box>

        <Box>
          <Paper elevation={0} className={s.bordered}>
            <Box py={2.5} px={4.5}>
              <Typography component="pre" variant="subtitle1" align="center">
                {`Официальный дилер ${vehicle.city?.name ? `\n г. ${vehicle.city?.name}` : ''}`}
              </Typography>
            </Box>
          </Paper>
        </Box>

        {vehicle.type === VEHICLE_TYPE.USED && (
          <Box pt={2.5}>
            <ReportBlock id={vehicle.id} />
          </Box>
        )}
      </Box>
    </Grid>
  );
});
