import React, { FC, memo, useMemo, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useRouter } from 'next/router';
import cx from 'classnames';
import compact from 'lodash/compact';
import {
  VehicleNew,
  VEHICLE_SCENARIO,
  VEHICLE_TYPE,
  APPLICATION_TYPE,
  SPECIAL_OFFER_ALIAS,
  CreditSubtype,
} from '@marketplace/ui-kit/types';
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
  useToggle,
} from '@marketplace/ui-kit';

import { createApplicationExpress } from 'api/lead';
import { createSingleApplication } from 'api';
import { SingleApplication, SingleApplicationCredit } from 'types/SingleApplication';
import { City } from 'types/City';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { useVehicleItem } from 'store/catalog/vehicle/item';
import { actions as userActions, selectUser } from 'store/user';
import { ComparisonButton } from 'containers/Comparison/ComparisonButton';
import { FavoritesButton } from 'containers/Favorites/FavoritesButton';
import { ExpressModal } from 'containers/Vehicle/VehicleBuyBlock/components/ExpressModal/ExpressModal';
import { ReportBlock } from 'containers/ReportBlock';
import { VehicleGifts } from 'components/VehicleGifts';
import { ReactComponent as IconTag } from 'icons/iconTag.svg';
import { unauthorizedGuard } from 'guards';
import { fireBookingAnalytics, fireExpressApplicationAnalytics, pushCriteoAnalyticsEvent } from 'helpers/analytics';
import { clamp } from 'helpers/clamp';
import { ContactsList } from 'components/ContactsList';
import { Pending } from 'helpers/pendings';
import { isBankautoDealerId } from 'helpers/isBankautoDealer';
import { getCreditProgram } from 'helpers/credit';
import { authModalTexts } from 'constants/authModalTexts';
import { createCreditFisApplication } from 'api/application';
import { SPECIAL_CREDIT_PROGRAM_MAP } from 'constants/application';
import { getCreateCreditFisParamsMapper } from 'api/mappers/creditFis';
import { CreditFisCreateParams } from 'types/CreditFis';
import SwitchBlock from './components/SwitchBlock/SwitchBlock';
import Price from './components/Price/Price';
import { PartnerBlock } from './components/PartnerBlock';
import { DiscountPopover } from './components/DiscountPopover/DiscountPopover';
import { ChangedConditionsMessageModal } from './components/ChangedConditionsMessageModal/ChangedConditionsMessageModal';
import { getCookieImpersonalization } from 'helpers/authCookies';
import { useStyles } from './VehicleBuyBlock.styles';
import { SubscriptionBlock } from './components/SubscriptionBlock/SubscriptionBlock';

const VehicleBuyBlock: FC = memo(() => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { push } = useRouter();
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const { vehicle } = useVehicleItem() as { vehicle: VehicleNew };
  const {
    id: vehicleId,
    price,
    discounts: { credit: creditDiscount = 0, tradeIn: tradeInDiscount = 0, market: marketDiscount = 0 },
    scenario,
    salesOfficeId,
    specialOffer,
    type,
    autotekaReportTeaser,
    bookingPrice,
  } = vehicle!;

  const isBooked: boolean = useMemo(() => Boolean(vehicle.isBooked), [vehicle]);

  const isAuthorized = user.isAuthorized && (user.firstName || getCookieImpersonalization());
  const isBankautoDealer = isBankautoDealerId(salesOfficeId);
  const isInitialized = user.isAuthorized !== null;

  const dealerView = `${scenario}` === VEHICLE_SCENARIO.USED_FROM_CLIENT;

  const priceWrapperRef = useRef<HTMLDivElement>(null);

  const carType = vehicle.type;
  const [isExpressModalOpen, setIsExpressModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isCreditChecked, isCreditCheckedActions] = useToggle(!!creditDiscount);
  const [isTradeInChecked, isTradeInCheckedActions] = useToggle(!!tradeInDiscount);
  const creditDiscountPrice = isCreditChecked ? creditDiscount : 0;
  const tradeInDiscountPrice = isTradeInChecked ? tradeInDiscount : 0;
  const currentPriceWithoutTradeIn = price! - creditDiscountPrice - marketDiscount;
  const currentPrice = currentPriceWithoutTradeIn - tradeInDiscountPrice;
  const mainDiscount = creditDiscount + tradeInDiscount + marketDiscount;
  const priceBankAuto = price - mainDiscount;
  const shouldCreateFisApplication = true;
  // const currentCreditPrice = price! - tradeInDiscountPrice - creditDiscount - marketDiscount;

  const [changedConditionsModalOpened, setChangedConditionsModalOpened] = useState<boolean>(false);

  const { reload } = useRouter();
  const handleReloadPage = () => {
    reload();
  };

  const creditProgram = useMemo(() => {
    return getCreditProgram({
      vehiclePrice: currentPriceWithoutTradeIn,
      creditAmount: currentPriceWithoutTradeIn,
      type: vehicle.type,
      year: vehicle.year,
      programName:
        (specialOffer?.alias && SPECIAL_CREDIT_PROGRAM_MAP[specialOffer.alias as SPECIAL_OFFER_ALIAS]) || undefined,
    });
  }, [currentPriceWithoutTradeIn, vehicle.type, vehicle.year, specialOffer?.alias]);

  const discounts = useMemo((): number => {
    return (
      // (isTradeInChecked ? (tradeInDiscount as number) : 0) +
      // (isCreditChecked ? (creditDiscount as number) : 0) +
      marketDiscount ? (marketDiscount as number) : 0
    );
  }, [
    // isTradeInChecked, isCreditChecked, creditDiscount, tradeInDiscount,
    marketDiscount,
  ]);

  const getCreditData = (creditAmount: number): SingleApplicationCredit | null => {
    if (!creditProgram?.initialPayment) {
      return null;
    }
    return {
      initial_payment: creditProgram?.initialPayment.default || creditProgram?.initialPayment.min,
      amount: creditAmount,
      term: creditProgram.term.max,
      discount: creditDiscount as number,
    };
  };

  const handleCreateApplication = async (
    applicationParams: SingleApplication,
    creditFisParams?: CreditFisCreateParams,
  ) => {
    try {
      setLoading(true);
      dispatch(
        userActions.setCallbackApplicationParams({
          applicationParams,
          creditParams: creditFisParams,
          acquiringBookingParams: vehicle.bookingPrice,
        }),
      );
      await unauthorizedGuard(
        `/create-application?type=${APPLICATION_TYPE.VEHICLE}`,
        authModalTexts[AuthSteps.AUTH].title,
        authModalTexts[AuthSteps.AUTH].text,
        vehicle.type === VEHICLE_TYPE.NEW ? RegistrationTypes.VEHICLE_NEW : RegistrationTypes.VEHICLE_USED,
      );
      const { data } = await Pending('create-application', createSingleApplication(applicationParams));
      if (creditFisParams) {
        await Pending(
          'create-credit-fis-application',
          createCreditFisApplication(getCreateCreditFisParamsMapper(data.uuid, creditFisParams)),
        );
      }
      fireBookingAnalytics({
        ...data,
        withCredit: isCreditChecked,
        withTradeIn: isTradeInChecked,
      });
      push(`/profile/applications/${(data as any).uuid}`);
    } catch (error: any) {
      if (error?.response?.data && error.response.data.code === '422' && error.response.data.detail) {
        setChangedConditionsModalOpened(true);
      }

      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBooking = () => {
    if (!creditProgram) {
      return;
    }

    const applicationParams: SingleApplication = {
      vehicle: {
        price: currentPrice,
        booking_price: vehicle.bookingPrice,
        vehicle_id: vehicle.id,
        type: carType,
        sales_office_id: vehicle.salesOfficeId,
        discount: discounts,
        gifts: vehicle.gifts.map(({ id }) => id),
        special_offer:
          specialOffer && specialOffer !== null
            ? {
                id: specialOffer.id,
                percent: specialOffer.percent,
                name: specialOffer.name,
                link: specialOffer.link,
                alias: specialOffer?.alias,
                vehicle_type: specialOffer?.vehicleType,
                application_type: specialOffer?.applicationType || null,
                dealer_discount: specialOffer?.dealerDiscount ?? 0,
              }
            : null,
      },
      trade_in: { discount: tradeInDiscount as number },
      insurance: null,
      credit:
        creditProgram && !shouldCreateFisApplication
          ? getCreditData(clamp(creditProgram.credit.min, currentPriceWithoutTradeIn, creditProgram.credit.max))
          : null,
    };

    if (shouldCreateFisApplication) {
      const creditFisParams: CreditFisCreateParams = {
        vehicleId: applicationParams.vehicle?.vehicle_id ? +applicationParams.vehicle?.vehicle_id : 0,
        salesOfficeId: applicationParams.vehicle?.sales_office_id ?? 0,
        initialPayment: (creditProgram.initialPayment?.default || creditProgram.initialPayment?.min) ?? 0,
        term: creditProgram.term.max,
        creditAmount: clamp(creditProgram.credit.min, currentPriceWithoutTradeIn, creditProgram.credit.max),
        creditDiscount,
        rate: creditProgram.rate,
        monthlyPayment: 0,
        subtype: carType === VEHICLE_TYPE.NEW ? CreditSubtype.VEHICLE_NEW : CreditSubtype.VEHICLE_USED,
        vehicleCost: currentPrice,
      };
      handleCreateApplication(applicationParams, creditFisParams);
    } else {
      handleCreateApplication(applicationParams);
    }
  };

  const handleOpenExpressModal = () => setIsExpressModalOpen(true);
  const handleCloseExpressModal = () => setIsExpressModalOpen(false);

  const maxDiscount = tradeInDiscount + creditDiscount + marketDiscount;

  const handleBestPriceClick = async () => {
    try {
      if (isAuthorized) {
        setLoading(true);
        const applicationExpressParams = {
          phone: user.phone,
          name: user.firstName,
          needTradeIn: isTradeInChecked,
          needCredit: isCreditChecked,
          vehicleId: vehicle.id,
          vehicleColor: vehicle.color.name,
        };

        const app = await createApplicationExpress(applicationExpressParams);
        pushCriteoAnalyticsEvent({
          rtrgAction: 'transaction',
          rtrgData: {
            transaction_id: app.data.id,
            products: [
              {
                id: vehicle?.id,
                price: vehicle?.price,
              },
            ],
          },
        });
        fireExpressApplicationAnalytics({
          userId: user.uuid,
          withCredit: isCreditChecked,
          withTradeIn: isTradeInChecked,
        });
      } else {
        pushCriteoAnalyticsEvent({
          rtrgAction: 'init_checkout',
          rtrgData: {
            products: [
              {
                id: vehicle.id,
                price: vehicle.price,
              },
            ],
          },
        });
      }

      handleOpenExpressModal();
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container direction="column" spacing={0}>
      <Paper elevation={0} className={cx(!isMobile && s.bordered)}>
        <Box px={isMobile ? 0 : 2.5} py={isMobile ? 0 : 2.5}>
          <div ref={priceWrapperRef}>
            <Box display="flex" alignItems="flex-start" justifyContent="space-between">
              <Box display="flex" alignItems="flex-end">
                <Price
                  price={isBankautoDealer ? priceBankAuto : currentPrice}
                  oldPrice={isBankautoDealer ? undefined : price}
                  useFrom={isBankautoDealer}
                />
                {!isBankautoDealer && maxDiscount ? (
                  <DiscountPopover
                    anchorRef={priceWrapperRef}
                    discounts={compact([
                      tradeInDiscount && {
                        title: 'В трейд-ин',
                        amount: tradeInDiscount,
                      },
                      creditDiscount && {
                        title: 'В кредит',
                        amount: creditDiscount,
                      },
                      marketDiscount && {
                        title: 'От дилера',
                        amount: marketDiscount,
                      },
                      {
                        title: 'Максимальная',
                        amount: maxDiscount,
                      },
                    ])}
                  />
                ) : null}
              </Box>
              <span>
                <span className={s.actionIcon}>
                  {isMobile ? <ComparisonButton usageType="buyBlock" offerId={vehicleId} vehicleType={type} /> : null}
                </span>
                <span className={s.actionIcon}>
                  {isMobile ? <FavoritesButton vehicleId={vehicleId} usageType="buyBlock" /> : null}
                </span>
              </span>
            </Box>
          </div>
          {!isBankautoDealer && marketDiscount ? (
            <Box mt={1.25}>
              <Divider />
              <Box my={1} display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="subtitle1">Скидка от дилера</Typography>
                <Typography variant="subtitle1" color="primary">
                  <PriceFormat value={marketDiscount} />
                </Typography>
              </Box>
              <Divider />
            </Box>
          ) : null}
          {!dealerView && (
            <Box mt={2.5}>
              <Typography variant="subtitle1" component="div">
                Способ покупки
              </Typography>
              <Box mt={1.5}>
                <SwitchBlock
                  title="В трейд-ин"
                  summary={!isBankautoDealer && tradeInDiscount !== 0 ? tradeInDiscount : undefined}
                  sign={!isBankautoDealer && tradeInDiscount !== 0 ? 'Скидка' : undefined}
                  checked={isTradeInChecked}
                  onChange={isTradeInCheckedActions.handleToggle}
                />
              </Box>
              <Box mt={1.25}>
                <SwitchBlock
                  title="В кредит"
                  summary={!isBankautoDealer && creditDiscount !== 0 ? creditDiscount : undefined}
                  sign={!isBankautoDealer && creditDiscount !== 0 ? 'Скидка' : undefined}
                  checked={isCreditChecked}
                  onChange={isCreditCheckedActions.handleToggle}
                />
              </Box>
              {vehicle.gifts.length ? <VehicleGifts gifts={vehicle.gifts} /> : null}
            </Box>
          )}
          {!dealerView && specialOffer && specialOffer !== null ? (
            <Paper elevation={0} className={s.specialOfferPaper}>
              {!isMobile ? (
                <div style={{ margin: '1.25rem 0' }}>
                  <Divider style={{ margin: '0 -1.25rem' }} />
                </div>
              ) : null}
              <div className={s.specialOfferContainer}>
                <div className={s.innerContent}>
                  <div className={s.iconContainer}>
                    <IconTag className={s.icon} />
                  </div>
                  <div className={s.contentContainer}>
                    <Grid container justify="space-between">
                      <Grid item xs={8}>
                        <div className={s.programContent}>
                          <Typography variant="subtitle1" component="span">
                            {specialOffer.name}
                          </Typography>
                        </div>
                      </Grid>
                      <Grid item xs={4} className={s.percent}>
                        <Typography variant="subtitle1" color="primary">
                          от {specialOffer.percent} %
                        </Typography>
                      </Grid>
                    </Grid>
                    {/* <div className={s.detailedInfoLink}> */}
                    {/*  <Link key={specialOffer.link} href={specialOffer.link} variant="h5" color="primary"> */}
                    {/*    Подробнее */}
                    {/*  </Link> */}
                    {/* </div> */}
                  </div>
                </div>
              </div>
            </Paper>
          ) : null}
        </Box>
      </Paper>
      {!dealerView && (
        <Box mt={2.5}>
          {isBankautoDealer ? (
            <>
              <Button
                className={s.bookButton}
                fullWidth
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                onClick={handleBestPriceClick}
                disabled={!isInitialized || loading}
              >
                {(!isInitialized || loading) && (
                  <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                    <CircularProgress size="2rem" />
                  </Box>
                )}
                <b>Получить лучшую цену</b>
              </Button>
            </>
          ) : (
            <Button
              className={s.bookButton}
              fullWidth
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              onClick={handleBooking}
              disabled={isBooked || loading}
            >
              {loading && (
                <Box position="absolute" left="calc(50% - 1rem)" top="calc(50% - 1rem)">
                  <CircularProgress size="2rem" />
                </Box>
              )}
              <b>{isBooked ? 'Автомобиль уже забронирован' : 'Забронировать онлайн'}</b>
              {isBooked ? null : (
                <>
                  <br />
                  {isCreditChecked && (
                    <Typography variant="caption">
                      Кредит от&nbsp;
                      <PriceFormat value={vehicle.creditInfo?.monthlyPayment} />
                      /мес
                    </Typography>
                  )}
                </>
              )}
            </Button>
          )}
          <SubscriptionBlock />
          <div className={s.contactContainer}>
            <ContactsList />
          </div>
          <Divider />
          <Box pt={2.5} mt={1.25} px={isMobile ? 0 : 2.5}>
            {isBankautoDealer ? (
              <>
                <Typography variant="caption" component="p">
                  • Оставьте заявку
                </Typography>
                <Typography variant="caption" component="p">
                  • Обсудите условия покупки
                </Typography>
                <Typography variant="caption" component="p">
                  • Заберите авто в дилерском центре
                </Typography>
              </>
            ) : (
              <>
                <Typography variant="caption" component="p">
                  • {bookingPrice ? 'Гарантированное бронирование' : 'Предоплата не требуется'}
                </Typography>
                <Typography variant="caption" component="p">
                  • Условия и скидки фиксируются
                </Typography>
                <Typography variant="caption" component="p">
                  • Надежная защита личных данных
                </Typography>
                <Typography variant="caption" component="p">
                  • Оценка трейд-ин онлайн
                </Typography>
                <Typography variant="caption" component="p">
                  • Персональный менеджер
                </Typography>
              </>
            )}
          </Box>
        </Box>
      )}

      {vehicle.company && (
        <Box mt={2.5}>
          <Paper elevation={0} className={s.bordered}>
            <Box py={2.5} px={4.5}>
              <PartnerBlock
                city={vehicle.city as City}
                company={vehicle.company}
                brandName={vehicle.brand.name}
                type={carType}
              />
            </Box>
          </Paper>
        </Box>
      )}

      {vehicle.type === VEHICLE_TYPE.USED && (
        <Box pt={2.5}>
          <ReportBlock id={vehicle.id} autotekaReportTeaser={autotekaReportTeaser} />
        </Box>
      )}

      {isAuthorized ? (
        <ExpressModal
          needTradeIn={isTradeInChecked}
          needCredit={isCreditChecked}
          isOpen={isExpressModalOpen}
          onClose={handleCloseExpressModal}
          handleChangeVisibility={setIsExpressModalOpen}
          showSuccessContent
        />
      ) : (
        <ExpressModal
          needTradeIn={isTradeInChecked}
          needCredit={isCreditChecked}
          isOpen={isExpressModalOpen}
          onClose={handleCloseExpressModal}
          handleChangeVisibility={setIsExpressModalOpen}
        />
      )}
      <ChangedConditionsMessageModal
        opened={changedConditionsModalOpened}
        handleOpened={setChangedConditionsModalOpened}
        onClose={handleReloadPage}
      />
    </Grid>
  );
});

export { VehicleBuyBlock };
