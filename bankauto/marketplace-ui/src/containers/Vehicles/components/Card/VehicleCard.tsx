import React, { FC, useCallback, useMemo, useRef } from 'react';
import cx from 'classnames';
import { Button, Divider, Grid, Typography } from '@material-ui/core';
import useBreakpoints from '@marketplace/ui-kit/hooks/useBreakpoints';
import { VehicleShort, VEHICLE_STATUS, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import { Link } from 'components/Link';
import { ReactComponent as IconDeleteRed } from '@marketplace/ui-kit/icons/iconCloseRed';
import { StickersChips } from 'components/StickersChips';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { isBankautoDealerName } from 'helpers/isBankautoDealer';
import { analyticsListCardDetailsClick, analyticsBestOffersItemClick } from 'helpers/analytics/events';
import { City } from 'types/City';
import { Label, VehicleCardData, VehicleCardPrice, VehicleCardPriceFrom, VehicleCardSlider } from './components';
import { useStyles } from './VehicleCard.styles';
import { SoldOutLabel } from 'components';
import { AutotekaBlock } from './components/AutotekaBlock/AutotekaBlock';
import { AutotekaBlockContextProvider } from './components/AutotekaBlock/context/AutotekaBlockContext';

type Props = VehicleShort & {
  height?: string;
  withSlider?: boolean;
  isBestOffersCard?: boolean;
  isInsideSlider?: boolean;
  showDeleteIcon?: boolean;
  handleDelete?: (id: number) => void;
};

export const VehicleCard: FC<Props> = ({
  id,
  brand,
  gifts,
  color,
  drive,
  discounts: { credit: creditDiscount = 0, tradeIn: tradeInDiscount = 0, market: marketDiscount = 0 },
  engine: { engine, engineVolume, enginePower },
  model,
  mileage,
  price,
  transmission,
  vin,
  type,
  height,
  photos,
  equipment,
  scenario,
  company,
  year,
  city,
  specialOffer,
  status,
  withSlider,
  isBestOffersCard,
  isInsideSlider,
  equipmentNode,
  stickers,
  showDeleteIcon = false,
  handleDelete,
  cancelReason,
  autotekaReportTeaser,
  creditInfo,
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const photosArray = useMemo(() => {
    return photos?.length ? photos.map((photo) => photo['750']) : [''];
  }, [photos]);
  const hasPhotos = !!photosArray[0].length;
  const isSold = status === VEHICLE_STATUS.SOLD;
  const isSoldC2C = cancelReason !== null;
  const offerLink = `/offer/${brand.alias}/${model.alias}/${id}`;
  const title = `${brand.name} ${model.name}`;
  const mainDiscount = creditDiscount + tradeInDiscount + marketDiscount;
  const discountPercent = Math.round((mainDiscount * 100) / (price || 1));
  const isBankautoDealer = isBankautoDealerName(company?.name || '');
  const priceBankAuto = price - mainDiscount;
  const autotekaRef = useRef<HTMLDivElement>(null);
  const sliderImages = useMemo(() => {
    return photosArray.map((item) => (
      <Grid item xs={12} sm={3} className={s.imageRoot}>
        <ImageWebpGen src={item} alt={title} />
      </Grid>
    ));
  }, [s.imageRoot, photosArray, title]);

  const labelsView = useMemo(
    () => (
      <div className={s.labels}>
        {specialOffer && specialOffer !== null ? (
          <Grid item className={cx(s.labelsItem, s.specialOfferLabel)}>
            <Label
              title={`от ${specialOffer.percent}%`}
              addition="По спецпрограмме"
              className={s.specialOfferPercent}
            />
          </Grid>
        ) : null}
        {/* eslint-disable-next-line no-nested-ternary */}
        {isSold ? (
          <div className={s.labelsItem}>
            <Label title="Автомобиль продан" />
          </div>
        ) : discountPercent ? (
          <div className={s.labelsItem}>
            <Label title={`Скидка ${discountPercent}%`} />
          </div>
        ) : null}
        {gifts.length ? (
          <div className={s.labelsItem}>
            <Label title="+ Подарок" />
          </div>
        ) : null}
      </div>
    ),
    [specialOffer, gifts, specialOffer, isSold, discountPercent],
  );
  const labelsViewSoldC2C = useMemo(() => {
    return isSoldC2C ? <SoldOutLabel /> : null;
  }, [isSoldC2C]);

  const handleCardClick = () => {
    analyticsListCardDetailsClick({
      isBankautoDealer,
    });
    if (isBestOffersCard) {
      analyticsBestOffersItemClick();
    }
  };

  const getStickersChips = useCallback(
    (isVisible: boolean) =>
      isVisible && !!stickers?.length ? (
        <div className={s.stickersContainer}>
          <StickersChips items={stickers} />
        </div>
      ) : null,
    [stickers],
  );

  return (
    <Link href={offerLink} disabled={isSold} color="inherit" style={{ display: 'block', height, position: 'relative' }}>
      <div
        className={cx(s.root, {
          [s.overlay]: isSold,
          [s.imageErrorBackground]: !hasPhotos && isSold,
        })}
        onClick={handleCardClick}
        role="link"
      >
        <div className={isMobile && withSlider ? s.sliderContainer : cx(s.slider, hasPhotos && s.sliderHover)}>
          {isMobile ? (
            (withSlider && (
              <div className={s.swiperWrapper}>
                <Grid container className={s.wrapper} wrap={isMobile ? 'nowrap' : 'wrap'}>
                  {sliderImages}
                </Grid>
              </div>
            )) || <ImageWebpGen src={photosArray[0]} alt={title} />
          ) : (
            <VehicleCardSlider images={photosArray} stretch alt={title} />
          )}
          {isBankautoDealer ? (
            <Grid container direction="column" className={s.imageLabel}>
              <Grid item className={s.imageLabelItem}>
                <ImageWebpGen src="/images/pechat.png" stretch />
              </Grid>
            </Grid>
          ) : (
            labelsViewSoldC2C || getStickersChips(!isMobile) || labelsView
          )}
          {showDeleteIcon && (
            <div className={s.deleteIconWrapper}>
              <IconDeleteRed width={30} height={30} onClick={() => handleDelete?.(id)} />
            </div>
          )}
          {type === VEHICLE_TYPE.USED && autotekaReportTeaser ? (
            <AutotekaBlockContextProvider
              autotekaReportTeaser={autotekaReportTeaser}
              anchorRef={autotekaRef}
              id={id}
              brandAlias={brand.alias}
              modelAlias={model.alias}
            >
              <div ref={autotekaRef}>
                <AutotekaBlock />
              </div>
            </AutotekaBlockContextProvider>
          ) : null}
        </div>
        <div style={{ padding: '.625rem 0', maxWidth: '100%' }}>
          <VehicleCardData
            id={id}
            brandName={brand.name}
            title={title}
            equipment={equipment}
            equipmentId={equipmentNode.id}
            color={color.name}
            year={year}
            mileage={mileage}
            transmission={transmission}
            drive={drive}
            engine={engine}
            volume={engineVolume}
            power={enginePower}
            companyName={company?.name}
            vin={vin}
            type={type}
            scenario={scenario}
            city={city as City}
            stickersChips={getStickersChips(isMobile && !isInsideSlider && !isBestOffersCard)}
            showActionButtons={!isSoldC2C ?? !isSold}
          />
        </div>
        <Divider />
        <div style={{ paddingTop: '.875rem' }}>
          {isBankautoDealer ? (
            <VehicleCardPriceFrom price={priceBankAuto} type={type} productionYear={year} creditInfo={creditInfo} />
          ) : (
            <VehicleCardPrice
              price={price}
              creditDiscount={creditDiscount || 0}
              tradeInDiscount={tradeInDiscount || 0}
              marketDiscount={marketDiscount || 0}
              type={type}
              productionYear={year}
              isSoldC2C={isSoldC2C}
              creditInfo={creditInfo}
              scenario={scenario}
            />
          )}
        </div>
        <Button
          variant="contained"
          color="primary"
          className={isBankautoDealer ? s.warningButton : undefined}
          disabled={isSold}
          style={{
            marginTop: isBankautoDealer ? '3rem' : '1.25rem',
            zIndex: 2,
          }}
          fullWidth
        >
          <Typography variant="h5">Подробнее</Typography>
        </Button>
      </div>
    </Link>
  );
};
