import React, { FC, useEffect, memo } from 'react';
import { VehicleNew } from '@marketplace/ui-kit/types';
import { Typography } from '@marketplace/ui-kit';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { InspectionInfo } from './InspectionInfo';
import { VehicleCardActions } from './VehicleCardActions';
import { useInspection } from '../useInspection';
import { useStyles } from './VehicleCard.styles';

interface Props {
  vehicle: VehicleNew;
}

export const VehicleCard: FC<Props> = memo(({ vehicle: { id, brand, model, generation, photos, city } }) => {
  const s = useStyles();
  const [inspection, fetchInspection] = useInspection(id);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  return (
    <div className={s.root}>
      <div className={s.imageContainer}>
        <ImageWebpGen src={photos[0]['750']} alt="vehicle image" />
      </div>

      <Typography variant="h5">{`${brand.name} ${model.name} ${generation.name}`}</Typography>
      <Typography variant="body2" color="textSecondary">
        {city.name}
      </Typography>

      {inspection && <InspectionInfo inspection={inspection} />}

      <VehicleCardActions vehicleId={id} inspection={inspection} fetchInspection={fetchInspection} />
    </div>
  );
});
