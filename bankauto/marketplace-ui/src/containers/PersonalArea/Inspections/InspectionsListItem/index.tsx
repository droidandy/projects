import React, { FC, useMemo } from 'react';
import { Divider, Img, useBreakpoints, Typography } from '@marketplace/ui-kit';
import { InspectionVehicle } from '../types';
import { InspectionsListItemData } from './InspectionsListItemData';
import { InspectionsListItemActions } from './InspectionsListItemActions';
import { IMAGE_VEHICLE_CARD_DEFAULT } from '../constants';
import { useStyles } from './InspectionsListItem.styles';

interface Props {
  data: InspectionVehicle;
}

export const InspectionsListItem: FC<Props> = ({
  data: {
    id,
    vehicle,
    status,
    reportUrl,
    vehicle: { id: vehicleId, images, brand, model },
  },
}) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const leftBlock = useMemo(() => {
    const isEmptyImage = images.length === 0;
    const imageUrl = isEmptyImage ? IMAGE_VEHICLE_CARD_DEFAULT : images[0];
    const image = (
      <div className={s.imageWrapper}>
        <Img src={imageUrl} alt="Превью объявления" className={isEmptyImage ? s.defaultImage : undefined} />
      </div>
    );
    if (!isMobile) {
      return image;
    }
    return (
      <div className={s.leftBlock}>
        {image}
        <Typography variant="h5" component="p">
          Заявка
          <br />
          на осмотр
        </Typography>
      </div>
    );
  }, [images[0], isMobile]);

  return (
    <div className={s.root}>
      {leftBlock}
      <div className={s.contentWrapper}>
        <InspectionsListItemData id={id} vehicle={vehicle} status={status} reportUrl={reportUrl} />
        <div>
          {!isMobile && (
            <div className={s.dividerWrapper}>
              <Divider />
            </div>
          )}
          <InspectionsListItemActions
            id={id}
            vehicleId={vehicleId}
            brand={brand.alias!}
            model={model.alias!}
            reportUrl={reportUrl}
            status={status!}
          />
        </div>
      </div>
    </div>
  );
};
