import React, { FC } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { Link } from 'components';
import { INSPECTIONS_REPORT } from 'constants/expocar';
import { useStyles } from './VehicleCard.styles';

export const EmptyVehicleCard: FC = () => {
  const s = useStyles();

  return (
    <div className={s.root}>
      <div className={s.imageContainer}>
        <ImageWebpGen src="/images/expocar/vehicleCardInfo.jpg" alt="vehicle image" />
      </div>
      <Link href="/car/">
        <Button variant="contained" color="primary" size="large" className={s.choiceButton} fullWidth>
          <Typography variant="h5" component="span">
            Выбрать автомобиль
          </Typography>
        </Button>
      </Link>
      <a href={INSPECTIONS_REPORT} rel="noreferrer" target="_blank">
        <Button variant="text" color="primary" fullWidth>
          <Typography variant="h5" component="span">
            Пример диагностики
          </Typography>
        </Button>
      </a>
    </div>
  );
};
