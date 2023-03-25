import React, { FC } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { Inspection, INSPECTION_STATUS } from 'types/Inspection';
import { Link } from 'components';
import { MenuItems } from 'constants/menuItems';
import { BuyInspectionButton } from '../BuyInspectionButton';
import { INSPECTIONS_REPORT } from 'constants/expocar';
import { useStyles } from './VehicleCard.styles';

interface Props {
  vehicleId: number;
  inspection: Inspection | null;
  fetchInspection: () => void;
}

export const VehicleCardActions: FC<Props> = ({ vehicleId, inspection, fetchInspection }) => {
  const s = useStyles();

  const payButtonJsx = (
    <BuyInspectionButton
      vehicleId={vehicleId}
      isInspection={!!inspection}
      fetchInspection={fetchInspection}
      className={s.mainButton}
    />
  );

  if (!inspection) {
    return (
      <>
        {payButtonJsx}
        <a href={INSPECTIONS_REPORT} rel="noreferrer" target="_blank">
          <Button variant="text" color="primary" className={s.secondButton} fullWidth>
            <Typography variant="h5" component="span">
              Пример диагностики
            </Typography>
          </Button>
        </a>
      </>
    );
  }

  const { status, reportUrl } = inspection;

  const isNew = !!inspection && inspection.status === INSPECTION_STATUS.NEW;
  const inspectionsLink = MenuItems.Inspections.href;
  const isSuccess = status === INSPECTION_STATUS.SUCCEEDED && reportUrl;

  const buttonJsx = !isNew && (
    <Button variant="contained" size="large" color="primary" className={s.mainButton} fullWidth>
      <Typography variant="h5" component="span">
        {isSuccess ? 'Посмотреть отчет' : 'Перейти к заявке'}
      </Typography>
    </Button>
  );

  const mainButton = isNew ? (
    payButtonJsx
  ) : isSuccess ? (
    <a href={reportUrl!} rel="noreferrer" target="_blank">
      {buttonJsx}
    </a>
  ) : (
    <Link href={inspectionsLink}>{buttonJsx}</Link>
  );

  return (
    <>
      {mainButton}
      {isNew || isSuccess ? (
        <Link href={inspectionsLink}>
          <Button variant="text" color="primary" className={s.secondButton} fullWidth>
            <Typography variant="h5" component="span">
              Перейти к заявке
            </Typography>
          </Button>
        </Link>
      ) : null}
    </>
  );
};
