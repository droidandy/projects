import React, { FC } from 'react';
import { Typography } from '@marketplace/ui-kit';
import { EyeIcon } from 'icons/clientVehicleStatistic';
import { useOfferStatisticsContext } from './OfferStatisticsContext';
import { OfferStatisticsModal } from './OfferStatisticsModal';
import { useStyles } from './OfferStatisticsModal.styles';

export const OfferStatisticsButton: FC<{ vehicleId: string | number }> = ({ vehicleId }) => {
  const s = useStyles();
  const { fetchStatistics } = useOfferStatisticsContext();

  return (
    <>
      <div className={s.statisticsButton} onClick={fetchStatistics(vehicleId)}>
        <EyeIcon viewBox="0 0 32 32" className={s.icon} />
        <div className={s.butonText}>
          <Typography variant="h5" component="span" color="primary">
            Статистика
          </Typography>
        </div>
      </div>
      <OfferStatisticsModal />
    </>
  );
};
