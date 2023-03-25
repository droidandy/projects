import React, { FC, useState, MouseEvent, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Typography, Button, useBreakpoints } from '@marketplace/ui-kit';
import { VehicleNew } from '@marketplace/ui-kit/types';
import { createApplicationTestDrive } from 'api/lead';
import { StateModel } from 'store/types';
import { TestDriveBookingModal } from './modals/TestDriveBookingModal/TestDriveBookingModal';
import { TestDriveSuccessModal } from './modals/TestDriveSuccessModal/TestDriveSuccessModal';
import { ImageWebpGen } from 'components/ImageWebpGen';
import { AuthSteps, RegistrationTypes } from 'types/Authentication';
import { isBankautoDealerId } from 'helpers/isBankautoDealer';
import { useAuthorizeWrapper } from 'hooks/useAuthorizeWrapper';
import { authModalTexts } from 'constants/authModalTexts';
import { useStyles } from './TestDriveBlock.styles';

const imageSrc = '/images/testDrive/testDriveBannerImage.png';

const TestDriveBlock: FC<{ vehicle: VehicleNew }> = ({ vehicle }) => {
  const s = useStyles();
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isAnimationModalOpen, setIsAnimationModalOpen] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState(false);
  const isAuth = useSelector<StateModel, boolean>((store) => !!store.user.isAuthorized);
  const isBankautoDealer = isBankautoDealerId(vehicle?.salesOfficeId || 0);
  const { isMobile } = useBreakpoints();
  const handleCloseModal = useCallback(() => setIsAnimationModalOpen(false), [setIsAnimationModalOpen]);
  const authorizeWrapper = useAuthorizeWrapper();

  if (!vehicle) {
    return null;
  }
  const { brand, model, id } = vehicle;
  const handleTestDriveBooking = useCallback(async () => {
    setIsLoading(true);
    setIsOpen(true);
    try {
      await createApplicationTestDrive(id);
      setIsAnimationModalOpen(true);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
      setIsOpen(false);
    }
  }, [setIsOpen, setIsLoading, id, setIsAnimationModalOpen]);
  const handleClick = useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      if (!isAuth) {
        setIsOpen(false);
        return authorizeWrapper({
          regType: RegistrationTypes.TEST_DRIVE,
          authModalTitle: authModalTexts[AuthSteps.TEST_DRIVE].title,
          authModalText: authModalTexts[AuthSteps.TEST_DRIVE].text,
          callback: handleTestDriveBooking,
        });
      }
      handleTestDriveBooking();
    },
    [authorizeWrapper, isAuth, handleTestDriveBooking],
  );
  return (
    <>
      {isBankautoDealer && !isMobile ? (
        <Button
          variant="outlined"
          fullWidth
          onClick={() => setIsOpen(true)}
          color="primary"
          className={s.alternativeButton}
        >
          Записаться на тест-драйв
        </Button>
      ) : (
        <div className={s.contentWrapper}>
          <div className={s.imageWrapper}>
            <ImageWebpGen src={imageSrc} alt="test drive" />
          </div>
          <Typography variant="h5">
            Попробуйте
            <br />
            {brand.name} {model.name}
          </Typography>
          <Typography className={s.subText}>в движении</Typography>
          <Button variant="contained" fullWidth className={s.button} onClick={() => setIsOpen(true)}>
            Записаться на тест-драйв
          </Button>
        </div>
      )}
      <TestDriveBookingModal
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        loading={isLoading}
        handleClick={(e) => {
          handleClick(e!);
        }}
      />
      <TestDriveSuccessModal isVisible={isAnimationModalOpen} handleClose={handleCloseModal} />
    </>
  );
};
export { TestDriveBlock };
