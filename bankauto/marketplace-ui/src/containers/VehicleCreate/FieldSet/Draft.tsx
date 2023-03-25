import React, { memo, useCallback, FC } from 'react';
import { useFormState } from 'react-final-form';
import { useRouter } from 'next/router';
import { Button, Typography, CircularProgress } from '@marketplace/ui-kit';
import { VehicleFormSellValues } from 'types/VehicleFormType';
import { useVehicleDraftData } from 'store/catalog/vehicleDraft';
import { useNotifications } from 'store/notifications';
import { useFormVehicleContext } from '../FormContext';

type Props = {
  loading: boolean;
  setLoading: (loading: boolean) => void;
  isABTest?: boolean;
};

export const VehicleSubmitDraft: FC<Props> = memo(({ loading, setLoading, isABTest }) => {
  const router = useRouter();
  const { notifyError } = useNotifications();
  const { values, submitting } = useFormState<VehicleFormSellValues>();
  const { updateVehicleCreateDataDraft, setSentStatus } = useVehicleDraftData();
  const { id } = useFormVehicleContext();
  const vehicleId = Number(id);
  const handleSaveDraft = useCallback(() => {
    setLoading(true);
    updateVehicleCreateDataDraft({ id: vehicleId, ...values }, isABTest)
      .then(() => {
        setSentStatus(true);
        router.push('/profile/offers/');
      })
      .catch(() => notifyError('Ошибка при сохранении черновика, попробуйте снова!'))
      .finally(() => setLoading(false));
  }, [vehicleId, values, isABTest, notifyError, updateVehicleCreateDataDraft, setSentStatus]);

  return (
    <Button
      variant="outlined"
      color="primary"
      size="large"
      fullWidth
      style={{ maxWidth: '21.5625rem', padding: '1rem 0.625rem' }}
      onClick={handleSaveDraft}
      disabled={submitting || loading}
      endIcon={(submitting || loading) && <CircularProgress size="1rem" />}
    >
      <Typography variant="h5" component="span">
        Сохранить без публикации
      </Typography>
    </Button>
  );
});
