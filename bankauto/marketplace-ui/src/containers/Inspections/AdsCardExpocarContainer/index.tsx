import React, { FC, useEffect } from 'react';
import { VehicleNew } from '@marketplace/ui-kit/types';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { InspectionInfo } from './InspectionInfo';
import { InspectionDescription } from './InspectionDescription';
import { AdsCardExpocarContainerActions } from './AdsCardExpocarContainerActions';
import { useInspection } from '../useInspection';
import { useStyles } from './AdsCardExpocarContainer.styles';

type Props = {
  vehicle: VehicleNew;
};

export const AdsCardExpocarContainer: FC<Props> = ({ vehicle: { id, brand, model } }) => {
  const s = useStyles();
  const [inspection, fetchInspection] = useInspection(id);

  useEffect(() => {
    fetchInspection();
  }, [fetchInspection]);

  const link = `/inspections/${brand.alias}/${model.alias}/${id}`;

  return (
    <div className={s.root}>
      <div className={s.imageWrapper}>
        <ImageWebpGen src="/images/expocar/adsCardBannerImage.png" />
      </div>
      <div className={s.container}>
        <div className={s.contentWrapper}>
          {inspection ? <InspectionInfo link={link} inspection={inspection} /> : <InspectionDescription />}
        </div>

        <div className={s.buttonContainer}>
          <AdsCardExpocarContainerActions
            vehicleId={id}
            link={link}
            inspection={inspection}
            fetchInspection={fetchInspection}
          />
        </div>
      </div>
    </div>
  );
};
