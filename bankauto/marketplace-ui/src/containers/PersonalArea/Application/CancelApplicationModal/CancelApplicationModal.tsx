import { BackdropModal } from '@marketplace/ui-kit';
import React, { useCallback } from 'react';
import { SimpleModalNew } from 'components/SimpleModalNew';
import { ReactComponent as CancelApplicationIcon } from 'icons/iconProhibitNew.svg';
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { setApplicationVehicleStatus, useApplication } from '../../../../store/profile/application';
import { StateModel } from '../../../../store/types';
import { updateApplicationVehicleStatus } from '../../../../api';
import { fireBookingCancelAnalytics } from '../../../../helpers';

type CancelApplicationModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const CancelApplicationModal = ({ isOpen, setIsOpen }: CancelApplicationModalProps) => {
  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);
  const {
    vehicle: { id, status },
    container: { uuid },
  } = useApplication();
  const { uuid: userId } = useSelector((state: StateModel) => state.user);

  const dispatch = useDispatch();
  const handleCancel = useCallback(() => {
    updateApplicationVehicleStatus(id!, {
      status: APPLICATION_VEHICLE_STATUS.CANCEL,
    })
      .then(() => {
        fireBookingCancelAnalytics({
          uuid: uuid || '',
          applicationStatus: status || '',
          userId,
        });
        dispatch(setApplicationVehicleStatus(APPLICATION_VEHICLE_STATUS.CANCEL));
      })
      .then(() => {
        setIsOpen(false);
      });
  }, [id, uuid, status, userId, dispatch, setIsOpen]);

  return (
    <BackdropModal opened={isOpen} handleOpened={setIsOpen} onClose={handleCloseModal}>
      {({ handleClose }) => (
        <SimpleModalNew
          icon={CancelApplicationIcon}
          title="Отмена заявки"
          subtitle="Вы уверены, что хотите отменить заявку?"
          btnText="Да"
          onBtnClick={handleCancel}
          secondaryBtnText="Нет"
          onSecondaryBtnClick={handleClose}
          handleClose={handleClose}
          isClosable
        />
      )}
    </BackdropModal>
  );
};
