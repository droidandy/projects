import React, { FC } from 'react';
import { Box, Typography } from '@material-ui/core';
import { City } from 'types/City';

type Props = {
  title: string;
  color: string;
  productionYear: number;
  mileage: number;
  transmission: string;
  drive: string;
  engine: string;
  volume: string;
  power: number;
  brand: string;
  vin: string;
  city: City;
};

export const VehicleCardData: FC<Props> = ({
  title,
  vin,
  color,
  productionYear,
  mileage,
  transmission,
  drive,
  engine,
  volume,
  power,
  city,
}) => {
  const vehicleInfo = [transmission, drive, engine, `${volume} л.`, `${power} л.c.`].join(' • ');

  return (
    <>
      <Box pt={1.25}>
        <Typography component="span" variant="h5">
          {title}
        </Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography variant="body2" color="secondary">
          {`${productionYear} год${mileage ? `, ${mileage} км` : ''}`}
        </Typography>
        <Typography variant="body2" color="secondary">
          {`VIN: ${vin || 'не указан'}`}
        </Typography>
      </Box>
      <Box pt={1.25} style={{ minWidth: '3rem' }}>
        <Typography variant="body2" color="textPrimary" noWrap>
          {vehicleInfo}
        </Typography>
        <Typography
          variant="body2"
          color="textPrimary"
          style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
        >
          Цвет: {color}
        </Typography>
      </Box>
      <Box pt={3.5} pb={1.25} display="flex" justifyContent="space-between">
        <Typography variant="body2" component="span" color="secondary">
          Официальный дилер
        </Typography>

        <Typography variant="body2" component="span" color="secondary">
          г. {city?.name}
        </Typography>
      </Box>
    </>
  );
};
