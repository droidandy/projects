import React, { FC, useCallback } from 'react';
import {
  ButtonAdvanced,
  Grid,
  Icon,
  MobileModalContainer,
  MobileModalContent,
  MobileModalHeader,
  Paper,
} from '@marketplace/ui-kit';
import { BackdropModalActions } from '@marketplace/ui-kit/components/BackdropModal';
import { APPLICATION_INSURANCE_TYPE } from '@marketplace/ui-kit/types';
import { useRouter } from 'next/router';
import { ReactComponent as LogoRenis } from 'icons/logoRenins.svg';

import { OsagoText } from './OsagoText';
import { CascoText } from './CascoText';
import { useStyles } from './InsuranceModal.styles';

interface Props {
  type: APPLICATION_INSURANCE_TYPE;
  price?: number;
  paymentLink?: string;
  showBuyButton?: boolean;
}

const InsuranceModal: FC<Props & BackdropModalActions> = ({
  type,
  price,
  paymentLink,
  handleClose,
  showBuyButton = true,
}) => {
  const classes = useStyles();
  const { push } = useRouter();

  const handleBuy = useCallback(() => {
    if (!paymentLink) {
      return;
    }

    push(paymentLink, paymentLink);
  }, [paymentLink, push]);

  return (
    <Paper className={classes.modalRoot}>
      <MobileModalHeader showCloseButton onClose={handleClose}>
        <Icon component={LogoRenis} viewBox="0 0 375 30" className={classes.renisLogo} />
      </MobileModalHeader>
      <MobileModalContent>
        <MobileModalContainer className={classes.content}>
          <Grid container direction="column" spacing={2}>
            <Grid item>
              {type === APPLICATION_INSURANCE_TYPE.CASCO ? <CascoText price={price} /> : <OsagoText price={price} />}
            </Grid>
            {showBuyButton && (
              <Grid item>
                <ButtonAdvanced
                  disabled={!paymentLink}
                  type="submit"
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleBuy}
                >
                  Купить
                </ButtonAdvanced>
              </Grid>
            )}
          </Grid>
        </MobileModalContainer>
      </MobileModalContent>
    </Paper>
  );
};

export { InsuranceModal };
