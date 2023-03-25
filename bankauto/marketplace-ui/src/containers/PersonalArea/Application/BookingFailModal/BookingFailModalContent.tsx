import React from 'react';
import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconError } from 'icons/iconErrorNew.svg';
import { useStyles } from './BookingFailModal.styles';

type BookingFailModalContentProps = {
  onRetry: () => void;
};

export const BookingFailModalContent = ({ onRetry }: BookingFailModalContentProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconError} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Typography variant="body1" component="h5" align="center" className={s.title}>
        Операция отклонена
      </Typography>
      <Button fullWidth variant="contained" color="primary" size="large" onClick={onRetry}>
        <Typography variant="subtitle1" component="span">
          Повторить оплату
        </Typography>
      </Button>
    </>
  );
};
