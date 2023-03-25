import { Box, Button, Icon, Typography, useBreakpoints } from '@marketplace/ui-kit';
import React, { useCallback } from 'react';
import { StateModel } from 'store/types';
import { useSelector } from 'react-redux';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { ModalLight } from 'components/ModalLight';
import { useStyles } from './FavoriteSubscriptionSuccessModal.styles';

type FavoriteSubscriptionSuccessModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const FavoriteSubscriptionSuccessModal = ({ isOpen, setIsOpen }: FavoriteSubscriptionSuccessModalProps) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();

  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);
  const { email } = useSelector(({ user }: StateModel) => user);

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      <Box pb={4} pt={isMobile ? 1.5 : 0} display="flex" alignItems="center" justifyContent="center">
        <Icon component={IconSuccess} className={s.icon} viewBox="0 0 56 56" />
      </Box>
      <Box pb={2.5} textAlign="center">
        <Typography variant="body1" component="h5" className={s.title}>
          Мы будем присылать уведомления об изменении цен на избранные автомобили на {email}
        </Typography>
      </Box>
      <Button fullWidth variant="contained" color="primary" size="large" onClick={handleCloseModal}>
        <Typography variant="subtitle1" component="span">
          Продолжить
        </Typography>
      </Button>
    </ModalLight>
  );
};
