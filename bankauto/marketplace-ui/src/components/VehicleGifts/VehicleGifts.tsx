import React, { FC, memo } from 'react';
import { GiftNew } from '@marketplace/ui-kit/types';
import { ComponentProps } from 'types/ComponentProps';
import { Typography } from '@marketplace/ui-kit';
import { useStyles } from './VehicleGifts.styles';

const generateGiftsText = (gifts: GiftNew[]) => {
  const text = `${gifts.reduce(
    (acc, gift, index) =>
      `${acc}${gift.name}${(gifts.length !== index + 1 && (gifts.length === index + 2 ? ' и ' : ', ')) || ''}`,
    '',
  )} в подарок`.toLowerCase();

  return `${text.charAt(0).toUpperCase()}${text.slice(1)}`;
};

export interface Props extends ComponentProps {
  gifts: GiftNew[];
}

const VehicleGiftsRoot: FC<Props> = ({ gifts }) => {
  const s = useStyles();
  const giftsText = generateGiftsText(gifts);

  return (
    <div className={s.root}>
      <Typography className={s.text}>+ {giftsText}</Typography>
    </div>
  );
};

const VehicleGifts = memo(VehicleGiftsRoot);

export { VehicleGifts };
