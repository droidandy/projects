import React, { FC } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { Inspection, INSPECTION_STATUS } from 'types/Inspection';
import { Link } from 'components';
import { BuyInspectionButton } from '../BuyInspectionButton';
import { MenuItems } from 'constants/menuItems';
import { useStyles } from './AdsCardExpocarContainer.styles';

type Props = {
  link: string;
  vehicleId: number;
  inspection: Inspection | null;
  fetchInspection: () => void;
};

export const AdsCardExpocarContainerActions: FC<Props> = ({ vehicleId, inspection, link, fetchInspection }) => {
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
        <div className={s.buttonItemContained}>{payButtonJsx}</div>
        <Link href={link}>
          <Button variant="text" color="primary">
            <Typography variant="h5" component="span">
              Подробнее
            </Typography>
          </Button>
        </Link>
      </>
    );
  }

  const { reportUrl, status } = inspection;

  const inspectionsLink = MenuItems.Inspections.href;

  const isSuccessStatus = status === INSPECTION_STATUS.SUCCEEDED;
  const isSuccess = isSuccessStatus && reportUrl;
  const isNew = status === INSPECTION_STATUS.NEW;

  const buttonJsx = !isNew && (
    <Button variant="contained" size="large" color="primary" fullWidth>
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
      <div className={s.buttonItemContained}>{mainButton}</div>
      {isNew || isSuccess ? (
        <Link href={inspectionsLink}>
          <Button variant="text" color="primary" fullWidth>
            <Typography variant="h5" component="span">
              Перейти к заявке
            </Typography>
          </Button>
        </Link>
      ) : null}
    </>
  );
};
