import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { Inspection } from 'types/Inspection';
import { Chips } from 'containers/PersonalArea/components';
import { INSPECTION_CHIP_RECORD } from '../constants';
import { useStyles } from './VehicleCard.styles';

interface Props {
  inspection: Inspection;
}

export const InspectionInfo: FC<Props> = ({ inspection: { id, status } }) => {
  const s = useStyles();

  return (
    <div className={s.inspectionInfoWrapper}>
      <Typography variant="h5" component="span">
        Заявка на осмотр{' '}
      </Typography>
      <Typography variant="h5" component="span" color="textSecondary">
        № {id}
      </Typography>
      <div className={s.chipsWrapper}>
        <Chips items={INSPECTION_CHIP_RECORD[status]} />
      </div>
    </div>
  );
};
