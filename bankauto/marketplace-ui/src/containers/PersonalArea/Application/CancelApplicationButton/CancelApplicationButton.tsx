import React, { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { APPLICATION_VEHICLE_STATUS } from '@marketplace/ui-kit/types';
import { Button, Typography } from '@marketplace/ui-kit';
import { useApplication, setApplicationVehicleStatus } from 'store/profile/application';
import { updateApplicationVehicleStatus } from 'api';
import { fireBookingCancelAnalytics } from 'helpers';
import { StateModel } from 'store/types';

export const CancelApplicationButton = () => {
  const {
    vehicle: { id, status },
    container: { uuid },
  } = useApplication();
  const { uuid: userId } = useSelector((state: StateModel) => state.user);

  const dispatch = useDispatch();
  const handleCancel = useCallback(() => {
    updateApplicationVehicleStatus(id!, {
      status: APPLICATION_VEHICLE_STATUS.CANCEL,
    }).then(() => {
      fireBookingCancelAnalytics({
        uuid: uuid || '',
        applicationStatus: status || '',
        userId,
      });
      dispatch(setApplicationVehicleStatus(APPLICATION_VEHICLE_STATUS.CANCEL));
    });
  }, [dispatch, id, uuid, status, userId]);

  if (
    status === APPLICATION_VEHICLE_STATUS.CANCEL ||
    status === APPLICATION_VEHICLE_STATUS.DRAFT ||
    status === APPLICATION_VEHICLE_STATUS.SUCCESS
  ) {
    return null;
  }

  return (
    <Button onClick={handleCancel} fullWidth color="primary" variant="outlined" size="large">
      <Typography variant="h5">Отменить бронирование</Typography>
    </Button>
  );
};
