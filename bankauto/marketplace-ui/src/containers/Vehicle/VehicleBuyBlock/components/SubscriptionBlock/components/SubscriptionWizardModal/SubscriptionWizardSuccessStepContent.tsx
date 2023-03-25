import React from 'react';
import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { useStyles } from './SubscriptionWizardModal.styles';

type SubscriptionWizardSuccessStepContentProps = {
  onClose: () => void;
};

export const SubscriptionWizardSuccessStepContent = ({ onClose }: SubscriptionWizardSuccessStepContentProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconSuccess} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Typography variant="subtitle1" component="h5" align="center">
        Ваша заявка отправлена
      </Typography>
      <Typography variant="body1" component="h5" align="center">
        Наш менеджер свяжется с вами в ближайшее время
      </Typography>
      <Box pt={6}>
        <Box height="14rem" position="relative" className={s.car}>
          <img src="/images/car7.png" alt="car" />
        </Box>
        <Button fullWidth variant="contained" color="primary" size="large" onClick={onClose}>
          <Typography variant="subtitle1" component="span">
            Готово
          </Typography>
        </Button>
      </Box>
    </>
  );
};
