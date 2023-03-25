import React, { FC, useState } from 'react';
import { BackdropModal, ButtonAdvanced, Grid, PriceFormat, Typography } from '@marketplace/ui-kit';
import { APPLICATION_INSURANCE_TYPE } from '@marketplace/ui-kit/types';
import { insuranceTitleMap } from 'constants/insuranceTitleMap';
import { InsuranceModal } from 'components/InsuranceModal';
import { ReactComponent as IconSuccess } from 'icons/iconSuccess.svg';
import { useStyles } from './InsuranceItem.styles';

interface Props {
  type: APPLICATION_INSURANCE_TYPE;
  cost?: number;
  paid?: boolean;
  paymentLink?: string;
}

const InsuranceItem: FC<Props> = ({ type, cost, paid = false, paymentLink }) => {
  const s = useStyles();
  const [modalOpened, setModalOpened] = useState(false);

  const handleOpenModal = () => {
    setModalOpened(true);
  };

  return (
    <div>
      <Grid container justify="space-between" alignItems="center">
        <Grid item>
          <Typography variant="body1">Полис {insuranceTitleMap[type]}</Typography>
          {!!cost && (
            <Typography variant="h4" component="div" color={paid ? 'textPrimary' : 'primary'}>
              <PriceFormat value={cost} />
              /год
            </Typography>
          )}
        </Grid>
        {!!cost && (
          <Grid item>
            {paid ? (
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <IconSuccess />
                </Grid>
                <Grid item>
                  <Typography className={s.successText}>Оплачен</Typography>
                </Grid>
              </Grid>
            ) : (
              <ButtonAdvanced className={s.detailsButton} variant="contained" size="small" onClick={handleOpenModal}>
                Подробнее
              </ButtonAdvanced>
            )}
          </Grid>
        )}
      </Grid>
      <BackdropModal opened={modalOpened} handleOpened={setModalOpened}>
        {({ handleClose }) => (
          <InsuranceModal type={type} price={cost} paymentLink={paymentLink} handleClose={handleClose} />
        )}
      </BackdropModal>
    </div>
  );
};

export { InsuranceItem };
