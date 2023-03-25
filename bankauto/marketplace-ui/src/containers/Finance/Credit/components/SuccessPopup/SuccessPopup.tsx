import React, { FC, useCallback, useState } from 'react';
import cx from 'classnames';
import { Typography, useBreakpoints, IconButton, Modal, Box, Button, CircularProgress } from '@marketplace/ui-kit';
import { ReactComponent as IconClose } from '@marketplace/ui-kit/icons/icon-close.svg';
import { ReactComponent as IconSuccessPopup } from '../../icons/IconSuccessPopup.svg';
import { useStyles } from './SuccessPopup.style';

interface Props {
  isVisible: boolean;
  handleClose: () => void;
}

const utm = '?utm_source=bda&utm_medium=credit&utm_campaign=credit&utm_content=credit&utm_term=credit';

const SuccessPopup: FC<Props> = ({ isVisible, handleClose }) => {
  const {
    animationBlock,
    animationCar,
    animationWheel,
    animationWheelRight,
    addAnimationForBg,
    addAnimationForCar,
    addAnimationForWheel,
  } = useStyles();
  const { isMobile } = useBreakpoints();
  const [isStartAnimation, setIsStartAnimation] = useState(false);
  const goToRedirect = useCallback(() => {
    setIsStartAnimation(true);
    setTimeout(() => {
      window.location.replace(`/${utm}`);
    }, 1750);
  }, []);
  return (
    <Modal open={isVisible}>
      <Box display="flex" justifyContent="center" height="100%" overflow="hidden scroll" bgcolor={isMobile && '#fff'}>
        <Box alignSelf="stretch" display="flex" alignItems="center" minHeight="40rem" maxWidth="100%">
          <Box
            position="relative"
            width="31.25rem"
            padding={isMobile ? '3.25rem 1.25rem 3.75rem' : '3.25rem 3.5rem 3.75rem'}
            bgcolor="#fff"
            borderRadius="0.5rem"
            display="flex"
            alignItems="center"
            flexDirection="column"
            textAlign="center"
            maxWidth="100%"
          >
            <Box position={isMobile ? 'fixed' : 'absolute'} right="0.8125rem" top="0.8125rem">
              <IconButton aria-label="close" onClick={handleClose}>
                <IconClose />
              </IconButton>
            </Box>
            <Box
              width="3.5rem"
              height="3.5rem"
              mb="2rem"
              bgcolor="#00C092"
              borderRadius="50%"
              display="flex"
              justifyContent="center"
              alignItems="center"
            >
              <IconSuccessPopup />
            </Box>
            <Box mb={isMobile ? '1.25rem' : '0.375rem'}>
              <Typography variant="h5">Ваша заявка отправлена</Typography>
            </Box>
            <Typography variant="body1">Решение придет в смс-сообщении</Typography>
            <Box m={isMobile ? '1.875rem 0 1.25rem' : '2.6875rem 0 0.625rem'}>
              <Typography variant={isMobile ? 'h5' : 'h4'}>Твой новый авто уже в наличии у нас на #банкавто</Typography>
            </Box>
            <Typography variant="body1">
              <Typography color="primary" component="span">
                #банкавто
              </Typography>{' '}
              — автомобильный маркетплейс, проект ПАО «РГС Банк».
            </Typography>

            {/* Блок с анимацией */}
            <Box className={cx(animationBlock, { [addAnimationForBg]: isStartAnimation })}>
              <Box className={cx(animationCar, { [addAnimationForCar]: isStartAnimation })}>
                <Box className={cx(animationWheel, { [addAnimationForWheel]: isStartAnimation })} />
                <Box
                  className={cx(animationWheel, animationWheelRight, { [addAnimationForWheel]: isStartAnimation })}
                />
              </Box>
            </Box>

            <Button
              size="large"
              color="primary"
              variant="contained"
              onClick={goToRedirect}
              disabled={isStartAnimation}
              fullWidth
            >
              {isStartAnimation ? (
                <CircularProgress size="1.5rem" />
              ) : (
                <Typography variant="h5">Подобрать автомобиль</Typography>
              )}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
};

export { SuccessPopup };
