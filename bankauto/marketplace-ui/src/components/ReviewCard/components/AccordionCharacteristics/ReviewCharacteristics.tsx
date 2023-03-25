import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { ReviewVehicleCharacteristics } from 'types/Review';
import { getMappedCharacteristics } from 'components/ReviewCard/helpers';
import { CharacteristicsItem } from './CharacteristicsItem';
import { useStyles } from './ReviewCharacteristics.styles';

interface Props {
  characteristics: ReviewVehicleCharacteristics;
}

export const ReviewCharacteristics: FC<Props> = ({ characteristics }) => {
  const s = useStyles();
  const mappedCharacteristicsValues = Object.values(getMappedCharacteristics(characteristics));
  return (
    <div>
      <Typography className={s.characteristicTitle} variant="h5">
        Характеристики
      </Typography>
      <div className={s.accordionDetailsRoot}>
        {mappedCharacteristicsValues.map((item) => (
          <CharacteristicsItem {...item} />
        ))}
      </div>
    </div>
  );
};
