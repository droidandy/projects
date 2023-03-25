import React, { FC, useCallback, useState } from 'react';
import { Typography, Modal, Button, CircularProgress } from '@marketplace/ui-kit';
import cx from 'classnames';
import { ReactComponent as IconSuccess } from 'icons/iconSuccessNew.svg';
import { useStyles } from './TestDriveSuccessModal.styles';

interface Props {
  isVisible: boolean;
  handleClose: () => void;
}

const TestDriveSuccessModal: FC<Props> = ({ isVisible, handleClose }) => {
  const {
    root,
    container,
    title,
    animationBlock,
    animationCar,
    animationWheel,
    animationWheelRight,
    addAnimationForBg,
    addAnimationForCar,
    addAnimationForWheel,
  } = useStyles();
  const [isStartAnimation, setIsStartAnimation] = useState(false);
  const handleStartAnimation = useCallback(() => {
    setIsStartAnimation(true);
    setTimeout(() => {
      handleClose();
      setIsStartAnimation(false);
    }, 1750);
  }, [setIsStartAnimation]);
  return (
    <Modal open={isVisible}>
      <div className={root}>
        <div className={container}>
          <IconSuccess />
          <Typography variant="h5" className={title}>
            Ваша заявка отправлена
          </Typography>
          <Typography variant="body1">
            Наш менеджер свяжется с вами
            <br /> в ближайшее время
          </Typography>

          {/* Блок с анимацией */}
          <div className={cx(animationBlock, { [addAnimationForBg]: isStartAnimation })}>
            <div className={cx(animationCar, { [addAnimationForCar]: isStartAnimation })}>
              <div className={cx(animationWheel, { [addAnimationForWheel]: isStartAnimation })} />
              <div className={cx(animationWheel, animationWheelRight, { [addAnimationForWheel]: isStartAnimation })} />
            </div>
          </div>

          <Button
            size="large"
            color="primary"
            variant="contained"
            onClick={handleStartAnimation}
            disabled={isStartAnimation}
            fullWidth
          >
            {isStartAnimation ? <CircularProgress size="1.5rem" /> : <Typography variant="h5">Готово</Typography>}
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export { TestDriveSuccessModal };
