import React from 'react';
import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { useStyles } from './MeetingModal.styles';

type MeetingModalInitContentProps = {
  onChooseDatetime: () => void;
  onRequestCallback?: () => void;
};

export const MeetingModalInitContent = ({ onChooseDatetime, onRequestCallback }: MeetingModalInitContentProps) => {
  const { isMobile } = useBreakpoints();
  const s = useStyles();

  return (
    <>
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconSuccess} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Typography variant="body1" component="h5" align="center" className={s.title}>
        Автомобиль забронирован!
      </Typography>
      <div className={s.textWrapper}>
        <Typography variant="body1" align="center">
          Выберите желаемую дату и время визита <br /> в дилерский центр
        </Typography>
      </div>
      <Button fullWidth variant="contained" color="primary" size="large" onClick={onChooseDatetime}>
        <Typography variant="subtitle1" component="span">
          Выбрать время визита
        </Typography>
      </Button>
      {onRequestCallback && (
        <>
          <div className={s.textWrapperBottom}>
            <Typography variant="body1" align="center">
              или <br /> обсудите детали встречи с менеджером
            </Typography>
          </div>
          <Button fullWidth variant="outlined" color="primary" size="large" onClick={onRequestCallback}>
            <Typography variant="subtitle1" component="span">
              Заказать обратный звонок
            </Typography>
          </Button>
        </>
      )}
    </>
  );
};
