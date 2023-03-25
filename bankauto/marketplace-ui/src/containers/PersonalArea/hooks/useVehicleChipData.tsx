import { useMemo } from 'react';
import { VEHICLE_STATUS } from '@marketplace/ui-kit/types';

type Props = {
  vehicleStatus: VEHICLE_STATUS;
};

export const useVehicleChipsData = ({ vehicleStatus }: Props) =>
  useMemo(() => {
    switch (vehicleStatus) {
      case VEHICLE_STATUS.CLIENT_DEACTIVATED: {
        return [{ text: 'Снят с публикации клиентом', bgcolor: 'primary.main' }];
      }
      case VEHICLE_STATUS.DEALER_DEACTIVATED: {
        return [{ text: 'Снят с публикации дилером', bgcolor: 'primary.main' }];
      }
      case VEHICLE_STATUS.SOLD: {
        return [{ text: 'Продан', bgcolor: 'primary.main' }];
      }
      default: {
        return [{ text: 'Отклонено', bgcolor: 'primary.main' }];
      }
    }
  }, [vehicleStatus]);
