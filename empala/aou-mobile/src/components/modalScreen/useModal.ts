import { useState, useEffect, useCallback } from 'react';

import * as RootNavigation from '~/app/home/navigation/RootNavigation';
import { Routes } from '~/app/home/navigation/routes';
import { Modals, ModalParams, ModalsInitialValues } from '~/constants/modalScreens';

export { ModalScreen } from './ModalScreen';

type Props = {
  activeModal: Modals,
  defaultValues: ModalParams,
};

type Result = [
  { selectedValue: ModalParams },
  ({ activeModal }: Props) => void,
];

export const useModal = (): Result => {
  const [selectedValue, setValue] = useState<ModalParams>(ModalsInitialValues);
  const params = RootNavigation.getParams();

  const showModal = useCallback(({ activeModal, defaultValues }: Props) => {
    const backScreen = RootNavigation.getRouteName() as Routes;

    setValue(undefined);
    RootNavigation.navigate(Routes.ModalScreen, {
      backScreen,
      activeModal,
      defaultValues,
    });
  }, [RootNavigation]);

  useEffect(() => {
    if (params?.selectedValue) {
      setValue(params.selectedValue);
    }
  }, [params]);

  return [{ selectedValue }, showModal];
};
