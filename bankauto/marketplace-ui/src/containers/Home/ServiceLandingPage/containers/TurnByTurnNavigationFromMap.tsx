import React from 'react';
import { useServiceRequest } from 'store/service/request';
import { ServiceStep } from 'types/Service';
import { getInitialServiceRequestValues } from 'containers/ServiceRequest/utils';
import { SelectCarService } from './SelectCarService';
import { NavHeader } from '../components/NavHeader';
import { SuccessPopup } from '../components/SuccessPopup';
import { AdditionalInformation } from './AdditionalInformation';
import { MapSearch } from './MapSearch';
import { Confirmation } from './Confirmation';
import { getWorkTypeDescription } from '../helpers';

type navSchemeProps = {
  data: any;
  navigate: (step: ServiceStep) => void;
};

const carDetails = ({ data, navigate }: navSchemeProps) => {
  let items = [];

  if (getWorkTypeDescription(data.workType)) {
    items.push({ label: getWorkTypeDescription(data.workType), onClick: () => navigate(ServiceStep.WORK_TYPE) });
  }

  if (data.brand) {
    items.push({ label: data.brand?.label });
  }

  if (data.model) {
    items.push({ label: data.model?.label });
  }

  if (data.year) {
    items.push({ label: data.year?.label });
  }
  return items;
};

const navScheme = ({ data, navigate }: navSchemeProps) =>
  ({
    [ServiceStep.WORK_TYPE]: {
      Screen: SelectCarService,
      screenProps: {},
      navProps: {},
    },
    [ServiceStep.CAR_INFO]: {
      Screen: AdditionalInformation,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.WORK_TYPE),
        items: carDetails({ data, navigate }),
      },
    },
    [ServiceStep.SEARCH_MAP]: {
      Screen: MapSearch,
      screenProps: { withMap: false },
      navProps: {
        onBack: () => navigate(ServiceStep.CAR_INFO),
        items: carDetails({ data, navigate }),
      },
    },
    [ServiceStep.CONFIRMATION]: {
      Screen: Confirmation,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.SEARCH_MAP),
        items: carDetails({ data, navigate }),
      },
    },
  } as any);

export const TurnByTurnNavigationFromMap = () => {
  const [successPopupIsVisible, setSuccessPopupIsVisible] = React.useState(false);
  const {
    state: { values, step },
    setServiceStep,
    updateServiceRequest,
    setServiceRequest,
    clearServiceRequest,
  } = useServiceRequest();
  const initialValues = getInitialServiceRequestValues();
  const { Screen, navProps, screenProps } = navScheme({ data: values, navigate: setServiceStep })[step];

  const onChange = React.useCallback(
    ({ values }: any) => {
      updateServiceRequest(values, false);
    },
    [updateServiceRequest],
  );

  const onSet = React.useCallback(
    (values: any) => {
      setServiceRequest(values, true);
    },
    [setServiceRequest],
  );

  const callbackOnClose = React.useCallback(() => {
    setSuccessPopupIsVisible(false);
  }, []);

  const orderCreated = React.useCallback(() => {
    setSuccessPopupIsVisible(true);
  }, []);

  return (
    <>
      <SuccessPopup isVisible={successPopupIsVisible} handleClose={callbackOnClose} />
      <Screen
        {...screenProps}
        header={<NavHeader {...navProps} />}
        initialValues={initialValues}
        data={values}
        onChange={onChange}
        onSet={onSet}
        navigate={setServiceStep}
        onClear={clearServiceRequest}
        orderCreated={orderCreated}
      />
    </>
  );
};
