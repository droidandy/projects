import React, { FC } from 'react';
import cx from 'classnames';
import { Button, Divider, Grid, PriceFormat, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleInstalmentListItem } from 'types/Vehicle';
import { breakpoints } from 'theme/breakpoints';
import { Link } from 'components';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { VehiclesSlider } from 'containers/Vehicle/components/VehiclesSlider';
import { VehicleCardSlider } from 'containers/Vehicles/components/Card/components';
import { VehicleCardData, VehicleCardPrice } from './components';
import { Label } from '../Label';
import { useStyles } from './VehicleCard.styles';

export const VehicleCard: FC<VehicleInstalmentListItem & { height?: string; slidesPerViewMobile?: number }> = ({
  id,
  brand,
  color,
  drive,
  photos: images,
  engine,
  enginePower: power,
  engineVolume: volume,
  model,
  mileage,
  installmentPayment,
  installmentMonths,
  transmission,
  year: productionYear,
  vin,
  height,
  city,
  specialOffer,
  text,
  priceWithoutDiscounts,
}) => {
  const { root, labels, labelsItem, slider, mobileSlider, mobileSliderItem, carDataWrapper } = useStyles();
  const { isMobile } = useBreakpoints();
  const link = `/installment/${brand.alias}/${model.alias}/${id}`;
  const title = `${brand.name} ${model.name}`;
  const imagesArray = images?.length ? images.map((photo) => photo['750']) : [''];
  const chipText = specialOffer ? text : '0% первый взнос';
  const priceDescription =
    specialOffer && priceWithoutDiscounts ? (
      <>
        Полная стоимость <PriceFormat value={priceWithoutDiscounts} />
      </>
    ) : (
      'Без первоначального взноса'
    );

  return (
    <Link href={link} color="inherit" style={{ display: 'block', height }}>
      <Grid container direction="column" justify="center" className={root}>
        <Grid item className={cx(slider, !images?.length && 'defaultImage')}>
          {!isMobile ? (
            <VehicleCardSlider images={imagesArray} stretch alt={title} />
          ) : (
            <VehiclesSlider
              stretch
              title={title}
              className={mobileSlider}
              classItem={cx(mobileSliderItem, !images?.length && 'defaultImage')}
              customSwiperParams={{
                loop: false,
                breakpoints: {
                  [breakpoints.values.xs]: {
                    slidesPerView: 1,
                  },
                },
              }}
            >
              {imagesArray.map((item: string) => (
                <ImageWebpGen key={item} src={item} />
              ))}
            </VehiclesSlider>
          )}
          <Grid container direction="column" className={labels}>
            <Grid item className={labelsItem}>
              <Label title={chipText} />
            </Grid>
          </Grid>
        </Grid>
        <Grid item className={carDataWrapper}>
          <VehicleCardData
            title={title}
            color={color.name}
            productionYear={productionYear}
            mileage={mileage}
            transmission={transmission}
            drive={drive}
            engine={engine}
            volume={volume}
            power={power}
            brand={brand.name}
            vin={vin}
            city={city}
          />
        </Grid>
        <Divider />
        <Grid item>
          <VehicleCardPrice
            price={installmentPayment}
            months={specialOffer && specialOffer.installmentTerm ? specialOffer.installmentTerm : installmentMonths}
            description={priceDescription}
          />
        </Grid>
        <Grid item>
          <Button variant="contained" color="primary" fullWidth>
            <b>Подробнее</b>
          </Button>
        </Grid>
      </Grid>
    </Link>
  );
};
