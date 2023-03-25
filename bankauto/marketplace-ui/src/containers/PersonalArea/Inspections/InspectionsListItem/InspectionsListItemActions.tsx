import React, { FC } from 'react';
import { Button, CircularProgress, PriceFormat, Typography } from '@marketplace/ui-kit';
import { INSPECTION_VEHICLE_STATUS } from '../types';
import { useInspectionsContext } from '../InspectionsContext';
import { Link } from 'components/Link'; //TODO: Заменить в модуле
import { CancelButton } from './CancelButton';
import { INSPECTION_PRICE } from '../constants';
import { useBuyInspection } from '../useBuyInspection';
import { useStyles } from './InspectionsListItem.styles';

interface Props {
  id: number;
  vehicleId: number;
  brand: string;
  model: string;
  reportUrl: string | null;
  status: INSPECTION_VEHICLE_STATUS;
}

export const InspectionsListItemActions: FC<Props> = ({ id, vehicleId, status, reportUrl, brand, model }) => {
  const s = useStyles();
  const {
    actions: { handleRemove },
  } = useInspectionsContext();
  const { loading, handleClick, inspectionModalJsx } = useBuyInspection({
    vehicleId,
  });

  const isRemovable = [INSPECTION_VEHICLE_STATUS.NEW, INSPECTION_VEHICLE_STATUS.PAID].includes(status);

  const button =
    INSPECTION_VEHICLE_STATUS.NEW === status ? (
      <>
        <Button
          size="large"
          color="primary"
          disabled={loading}
          variant="contained"
          endIcon={loading && <CircularProgress size="1rem" />}
          onClick={handleClick}
          fullWidth
        >
          <Typography variant="h5" component="p">
            Оплатить <PriceFormat value={INSPECTION_PRICE} />
          </Typography>
        </Button>
        {inspectionModalJsx}
      </>
    ) : INSPECTION_VEHICLE_STATUS.SUCCEEDED === status && reportUrl ? (
      <a href={reportUrl} rel="noreferrer" target="_blank">
        <Button onClick={() => {}} variant="contained" color="primary" fullWidth>
          <Typography variant="h5">Посмотреть отчет</Typography>
        </Button>
      </a>
    ) : null;

  return (
    <div className={s.actionsWrapper}>
      <div className={s.mainButtonWrapper}>{button}</div>

      <div className={s.rightButtonsGroup}>
        <Link href={`/offer/${brand}/${model}/${vehicleId}`}>
          <Button variant="text" color="primary">
            <Typography variant="h5" color="primary">
              Посмотреть объявление
            </Typography>
          </Button>
        </Link>
        {isRemovable && (
          <CancelButton
            text="Отменить заявку"
            callback={INSPECTION_VEHICLE_STATUS.NEW === status ? handleRemove(id) : undefined}
            className={s.lastButton}
          ></CancelButton>
        )}
      </div>
    </div>
  );
};
