import React, { FC, memo } from 'react';
import { PriceFormat, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { InspectionVehicleData } from '../types';
import { INSPECTION_VEHICLE_STATUS } from '../types';
import { Chip, Chips } from 'containers/PersonalArea/components'; //TODO: Заменить в модуле
import { Dictionary } from 'components'; //TODO: Заменить в модуле
import { formatNumber } from 'helpers/formatNumber'; //TODO: Заменить в модуле
import { useStyles } from './InspectionsListItem.styles';

interface Props {
  id: number;
  status: INSPECTION_VEHICLE_STATUS;
  vehicle: InspectionVehicleData;
  reportUrl: string | null;
}

const InspectionsChipRecord: Record<INSPECTION_VEHICLE_STATUS, Chip[]> = {
  [INSPECTION_VEHICLE_STATUS.NEW]: [{ text: 'Ожидает оплаты', bgcolor: 'warning.main' }],
  [INSPECTION_VEHICLE_STATUS.PAID]: [
    { text: 'Оплачена', bgcolor: 'success.main' },
    { text: 'ожидает осмотра', bgcolor: 'warning.main' },
  ],
  [INSPECTION_VEHICLE_STATUS.CANCELED]: [{ text: 'Отменена заказчиком', bgcolor: 'warning.dark' }],
  [INSPECTION_VEHICLE_STATUS.FAILED]: [{ text: 'Отменена продавцом', bgcolor: 'warning.dark' }],
  [INSPECTION_VEHICLE_STATUS.SUCCEEDED]: [{ text: 'Осмотр завершен', bgcolor: 'success.main' }],
  [INSPECTION_VEHICLE_STATUS.REDEEMED]: [{ text: 'Денежные средства возвращены', bgcolor: 'primary.main' }],
};

export const InspectionsListItemData: FC<Props> = memo(
  ({
    id,
    status,
    vehicle,
    vehicle: {
      equipment: { volume, power },
    },
    reportUrl,
  }) => {
    const { isMobile } = useBreakpoints();
    const s = useStyles();

    const yearMilesData = [`${vehicle.productionYear} год`, `${formatNumber(vehicle.mileage)} км`];
    const vehicleCharacteristics = [
      vehicle.color,
      vehicle.transmission,
      vehicle.drive,
      vehicle.engine,
      `${volume} л.`,
      `${power} л.c.`,
    ];
    const vinData = `VIN: ${vehicle.vin || 'Не указан'}`;
    const textVariant = isMobile ? 'body2' : 'body1';

    const chipsItems = InspectionsChipRecord[status];
    const chipsJsx = chipsItems ? (
      <div className={s.chipsWrapper}>
        <Chips items={chipsItems} />
      </div>
    ) : null;

    const orderNumber = (
      <Typography variant={isMobile ? 'h6' : 'h5'} color="textSecondary">
        Заявка № {id}
      </Typography>
    );

    const header = (
      <>
        {isMobile ? (
          [orderNumber, chipsJsx]
        ) : (
          <>
            <div className={s.titleWrapper}>
              <Typography variant="h3" component="p">
                Заявка на осмотр
              </Typography>
              {chipsJsx}
            </div>
            {orderNumber}
          </>
        )}
      </>
    );

    return (
      <div className={s.dataWrapper}>
        <div className={s.header}>{header}</div>

        <Typography variant="h5" component="span" className={s.carName}>
          {`${vehicle.brand.name} ${vehicle.model.name} ${vehicle.generation}`}
          <PriceFormat value={vehicle.price} className={s.price} />
        </Typography>

        {!isMobile ? (
          <Dictionary items={[vinData, ...yearMilesData!]} variant={textVariant} />
        ) : (
          <>
            <Typography variant={textVariant}>{vinData}</Typography>
            <Dictionary items={yearMilesData!} variant={textVariant} />
          </>
        )}
        <Dictionary items={vehicleCharacteristics} className={s.characteristics} variant={textVariant} />
      </div>
    );
  },
);
