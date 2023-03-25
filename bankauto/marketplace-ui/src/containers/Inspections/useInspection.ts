import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { getInspectionByVehicleId } from 'api/client/inspections';
import { StateModel } from 'store/types';
import { Inspection } from 'types/Inspection';

export const useInspection = (vehicleId: number | null): [Inspection | null, () => void] => {
  const { isAuthorized } = useSelector((state: StateModel) => ({
    isAuthorized: state.user.isAuthorized && !!state.user.firstName,
  }));
  const [inspection, setInspection] = useState<Inspection | null>(null);

  const fetchInspection = useCallback(() => {
    if (isAuthorized && vehicleId) {
      getInspectionByVehicleId(vehicleId)
        .then(({ data }) => {
          setInspection(data.inspection);
        })
        .catch((e) => {
          setInspection((prevData) => prevData && null);
          console.log(e);
        });
    } else {
      setInspection((prevData) => prevData && null);
    }
  }, [vehicleId, setInspection, isAuthorized]);

  return [inspection, fetchInspection];
};
