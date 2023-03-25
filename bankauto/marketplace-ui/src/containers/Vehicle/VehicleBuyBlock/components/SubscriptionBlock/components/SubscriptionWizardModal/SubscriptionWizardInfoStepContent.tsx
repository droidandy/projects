import React from 'react';
import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconOk } from 'icons/iconOk.svg';
import { useStyles } from './SubscriptionWizardModal.styles';

type SubscriptionWizardInfoStepContentProps = {
  onContinue: () => void;
};

export const SubscriptionWizardInfoStepContent = ({ onContinue }: SubscriptionWizardInfoStepContentProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconOk} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Typography variant="subtitle1" component="h5" align="center">
        Подписка от #банкавто даст вам комфорт в эксплуатации авто и экономию на платежах
      </Typography>
      <Box pt={4}>
        <Button fullWidth variant="contained" color="primary" size="large" onClick={onContinue}>
          <Typography variant="subtitle1" component="span">
            Продолжить
          </Typography>
        </Button>
      </Box>
    </>
  );
};
