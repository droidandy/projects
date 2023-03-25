import React, { FC } from 'react';
import { Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { ReactComponent as IconSuccessNew } from 'icons/iconSuccessNew.svg';
import { useStyles } from './AuthenticationContainerC2C.styles';

interface Props {
  onClose: () => void;
}

export const SuccessModal: FC<Props> = ({ onClose }) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  return (
    <div className={s.successModalContainer}>
      <div className={s.successIconWrapper}>
        <Icon component={IconSuccessNew} className={s.icon} viewBox="0 0 56 56" />
      </div>

      <div className={s.successTextWrapper}>
        {!isMobile ? (
          <Typography variant="h5">Ваш номер телефона подтвержден.</Typography>
        ) : (
          <Typography component="pre" variant="h5">
            {'Ваш номер телефона \nподтвержден.'}
          </Typography>
        )}
      </div>

      <Button
        className={s.successModalBtn}
        onClick={onClose}
        type="button"
        variant="contained"
        size="large"
        color="primary"
        fullWidth
      >
        <Typography variant="h5" component="span">
          Продолжить
        </Typography>
      </Button>
    </div>
  );
};
