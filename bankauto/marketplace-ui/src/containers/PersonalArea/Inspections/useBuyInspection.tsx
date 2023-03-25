import React, { useCallback, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { createInspection } from 'api/client/inspections';
import { StateModel } from 'store/types';
import { useNotifications } from 'store/notifications';
import { ExpocarBuyModal, InfoModal } from './InspectionModals';

const MODAL_IN_CASE_OF_ERROR = [403, 404];

interface Props {
  vehicleId: number;
}

interface ReturnData {
  loading: boolean;
  handleClick: () => void;
  inspectionModalJsx: JSX.Element | null;
}

export const useBuyInspection = ({ vehicleId }: Props): ReturnData => {
  const { notifyError } = useNotifications();
  const { phone, email } = useSelector((state: StateModel) => ({
    phone: state.user.phone,
    email: state.user.email,
  }));

  const [applicationId, setApplicationId] = useState<number | null>(null);
  const [errorStatus, setErrorStatus] = useState<403 | 404 | null>(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpenModal(!isOpenModal);
  }, [isOpenModal]);

  const handleClick = useCallback(() => {
    if (errorStatus || applicationId) {
      toggleOpen();
      return;
    }
    setLoading(true);
    createInspection(vehicleId)
      .then(({ data: { orderId } }) => {
        toggleOpen();
        setApplicationId(orderId);
      })
      .catch((e) => {
        const { status } = e.response;
        if (MODAL_IN_CASE_OF_ERROR.includes(status)) {
          setErrorStatus(status);
          toggleOpen();
        } else {
          notifyError(e);
        }
      })
      .finally(() => {
        setLoading(false);
      });
  }, [toggleOpen, setLoading, errorStatus, applicationId, vehicleId]);

  const inspectionModalJsx = useMemo(() => {
    if (applicationId) {
      return (
        <ExpocarBuyModal
          isOpen={isOpenModal}
          toggleOpen={toggleOpen}
          phone={phone}
          email={email}
          orderId={applicationId}
        />
      );
    }
    return errorStatus ? <InfoModal isOpen={isOpenModal} toggleOpen={toggleOpen} status={errorStatus} /> : null;
  }, [applicationId, errorStatus, isOpenModal, phone, email, toggleOpen]);

  return {
    loading,
    handleClick,
    inspectionModalJsx,
  };
};
