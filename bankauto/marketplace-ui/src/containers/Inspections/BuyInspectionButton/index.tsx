import React, { FC } from 'react';
import classNames from 'classnames';
import { makeStyles } from '@material-ui/core/styles';
import { Button, CircularProgress, PriceFormat, Typography } from '@marketplace/ui-kit';
import { INSPECTION_PRICE } from 'constants/expocar';
import { useBuyInspection } from '../useBuyInspection';

const useStyles = makeStyles(
  () => ({
    payButton: {
      padding: '0.5rem 1.375rem',
    },
  }),
  { name: 'BuyInspectionButton' },
);

interface Props {
  vehicleId: number;
  isInspection: boolean | null;
  fetchInspection: () => void;
  className?: string;
}

export const BuyInspectionButton: FC<Props> = ({ vehicleId, isInspection, fetchInspection, className }) => {
  const s = useStyles();
  const { loading, handleClick, inspectionModalJsx } = useBuyInspection({
    vehicleId,
    callback: isInspection ? undefined : fetchInspection,
  });

  return (
    <>
      <Button
        size="large"
        color="primary"
        disabled={loading}
        variant="contained"
        className={classNames(s.payButton, className)}
        endIcon={loading && <CircularProgress size="1rem" />}
        onClick={handleClick}
        fullWidth
      >
        <Typography variant="h5" component="div">
          {isInspection ? 'Оплатить диагностику' : 'Заказать диагностику'}
          <Typography component="div" variant="subtitle2">
            за <PriceFormat value={INSPECTION_PRICE} />
          </Typography>
        </Typography>
      </Button>
      {inspectionModalJsx}
    </>
  );
};
