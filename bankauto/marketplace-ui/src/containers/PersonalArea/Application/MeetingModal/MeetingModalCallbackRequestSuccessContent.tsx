import React from 'react';
import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { useStyles } from './MeetingModal.styles';

type MeetingModalCallbackRequestSuccessContentProps = {
  onClose: () => void;
};

export const MeetingModalCallbackRequestSuccessContent = ({
  onClose,
}: MeetingModalCallbackRequestSuccessContentProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconSuccess} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Box pb={2.5} textAlign="center">
        <Typography variant="body1" component="h5" className={s.title}>
          Ваша заявка отправлена
        </Typography>
      </Box>
      <Box pb={isMobile ? 2.5 : 5}>
        <Typography align="center" variant="body1">
          Наш менеджер свяжется с вами <br /> в течение 3 минут
        </Typography>
      </Box>
      <Button fullWidth variant="contained" color="primary" size="large" onClick={onClose}>
        <Typography variant="subtitle1" component="span">
          Закрыть
        </Typography>
      </Button>
    </>
  );
};
