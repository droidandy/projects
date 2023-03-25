import React, { FC, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { CircularProgress } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { StateModel } from 'store/types';
import { useVehicleCreateValues } from 'store/catalog/create/values';
import { useVehicleCreateData } from 'store/catalog/create/data';
import { useVehicleCreateOptions } from 'store/catalog/create/options';
import { useVehicleCreateStickers } from 'store/catalog/create/stickers';
import { useNotifications } from 'store/notifications';
import { useVehicleDraftData } from 'store/catalog/vehicleDraft';
import { useFormVehicleContext } from 'containers/VehicleCreate/FormContext';
import { parseVehicleContacts, parseVehicleValues } from 'containers/VehicleCreate/utils';

const LoadingView = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10rem 0' }}>
    <CircularProgress />
  </div>
);

export const FormVehicleLoadOffer: FC = ({ children }) => {
  const { catalogType, id: offerId } = useFormVehicleContext();
  const { isAuthorized, ...user } = useSelector((state: StateModel) => state.user);
  const {
    state: { initial: optionsInitialized },
    fetchVehicleCreateOptions,
  } = useVehicleCreateOptions();
  const {
    state: { initial: stickersInitialized },
    fetchVehicleCreateStickers,
  } = useVehicleCreateStickers();
  const { setVehicleCreateValues } = useVehicleCreateValues();
  const { initData } = useVehicleCreateData();
  const { getVehicleDraftValues, clearVehicleDraftValues, draftData } = useVehicleDraftData();
  const { notifyError } = useNotifications();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!optionsInitialized) {
      fetchVehicleCreateOptions();
    }
    if (!stickersInitialized) {
      fetchVehicleCreateStickers();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fetchVehicleCreateOptions, fetchVehicleCreateStickers]);

  useEffect(() => {
    if (isAuthorized && offerId && (!draftData || +offerId !== draftData.vehicle.id)) {
      getVehicleDraftValues(Number(offerId!));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthorized, draftData]);

  useEffect(
    () => () => {
      clearVehicleDraftValues();
    },
    [],
  );

  const currentOffer = useMemo(() => {
    return offerId && draftData && +offerId === draftData.vehicle.id ? draftData : null;
  }, [offerId, draftData]);

  useEffect(() => {
    if (isAuthorized && currentOffer && optionsInitialized && stickersInitialized) {
      (async () => {
        try {
          const preparedValues: VehicleFormSellValues = {
            ...parseVehicleValues(currentOffer),
            ...parseVehicleContacts(user, currentOffer.contacts || {}, isAuthorized),
          };
          // modification hoc
          const { modification } = await initData(preparedValues, catalogType);
          //в статых объявлениях не создавался модификатор
          const modificationData = modification.find((item) =>
            currentOffer.equipment
              ? item.id === currentOffer.equipment.avitoModificationId
              : item.transmissionId === currentOffer.vehicle.transmissionId,
          );

          const { power = null, volume = null, transmissionId: transmission = null } = modificationData || {};

          await setVehicleCreateValues({
            ...preparedValues,
            power,
            volume,
            transmission: transmission || preparedValues.transmission,
            modification: modificationData?.id || null,
          });

          setReady(() => true);
        } catch (e) {
          notifyError('Не удалось загрузить данные автомобиля');
        }
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [catalogType, currentOffer, optionsInitialized, isAuthorized]);
  return <>{ready ? children : <LoadingView />}</>;
};
