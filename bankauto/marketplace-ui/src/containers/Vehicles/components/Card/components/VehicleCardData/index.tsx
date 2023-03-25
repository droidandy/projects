import React, { FC } from 'react';
import cx from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { VEHICLE_SCENARIO, VEHICLE_TYPE } from '@marketplace/ui-kit/types';
import Typography from '@marketplace/ui-kit/components/Typography';
import { City } from 'types/City';
import { FavoritesButton } from 'containers/Favorites';
import { ComparisonButton } from 'containers/Comparison/ComparisonButton';
import { Grid } from '@marketplace/ui-kit';

const useStyles = makeStyles(
  () => ({
    double: {
      display: 'flex',
      justifyContent: 'space-between',
    },
    centered: {
      alignItems: 'center',
    },
    description: {
      paddingTop: '.625rem',
      minWidth: '3rem',
    },
    owner: {
      paddingTop: '.5rem',
    },
    colorText: {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    auto: {
      width: 'auto',
    },
    iconAction: {
      '&:not(:last-of-type)': {
        paddingRight: '.625rem',
      },
    },
    hidden: {
      visibility: 'hidden',
    },
  }),
  { name: 'BestOffersSlide' },
);

type Props = {
  id: number;
  title: string;
  equipment?: string;
  equipmentId: number;
  color: string;
  year: number;
  mileage: number;
  transmission: string;
  drive: string;
  engine: string;
  volume: string;
  power: number;
  companyName?: string;
  vin: string;
  brandName: string;
  type: VEHICLE_TYPE;
  scenario: VEHICLE_SCENARIO;
  city: City;
  showActionButtons: boolean;
  stickersChips?: JSX.Element | null;
};

export const VehicleCardData: FC<Props> = ({
  id,
  title,
  equipment,
  vin,
  color,
  year,
  mileage,
  transmission,
  drive,
  engine,
  volume,
  power,
  brandName,
  type,
  scenario,
  city,
  showActionButtons,
  stickersChips,
}) => {
  const s = useStyles();
  const vehicleInfo = [transmission, drive, engine, `${volume} л.`, `${power} л.c.`].join(' • ');
  const equipmentInfo = equipment && type === VEHICLE_TYPE.NEW ? `Комлектация: ${equipment}` : <>&nbsp;</>;
  return (
    <div>
      <div className={cx(s.double, s.centered)}>
        <Typography variant="h5">{title}</Typography>
        <Grid container className={cx(s.auto, { [s.hidden]: !showActionButtons })}>
          <Grid item className={s.iconAction}>
            <ComparisonButton offerId={id} vehicleType={type} />
          </Grid>
          <Grid item className={s.iconAction}>
            <FavoritesButton vehicleId={id} />
          </Grid>
        </Grid>
      </div>
      <div className={s.double}>
        <Typography variant="body2" color="secondary">
          {`${year} год${mileage ? `, ${mileage} км` : ''}`}
        </Typography>
        <Typography variant="body2" color="secondary">
          {`VIN: ${vin || 'не указан'}`}
        </Typography>
      </div>
      {stickersChips}
      <div className={s.description}>
        <Typography variant="body2">{equipmentInfo}</Typography>
        <Typography variant="body2" noWrap>
          {vehicleInfo}
        </Typography>
        <Typography variant="body2" className={s.colorText}>
          Цвет: {color}
        </Typography>
      </div>
      <div className={s.owner}>
        {[`${VEHICLE_SCENARIO.USED_FROM_CLIENT}`, `${VEHICLE_SCENARIO.USED_AUCTION_AND_CLIENT}`].includes(
          `${scenario}`,
        ) ? (
          <div className={s.double}>
            <Typography variant="body2" color="secondary" component="span">
              Частное лицо
            </Typography>
            <Typography variant="body2" color="secondary" component="span">
              {city?.name ? `г. ${city.name}` : null}
            </Typography>
          </div>
        ) : (
          <div className={s.double}>
            <Typography variant="body2" color="secondary" component="span">
              {`Официальный дилер ${type === VEHICLE_TYPE.NEW ? brandName : ''}`}
            </Typography>
            <Typography variant="body2" color="secondary" component="span">
              {city?.name ? `г. ${city.name}` : null}
            </Typography>
          </div>
        )}
      </div>
    </div>
  );
};
