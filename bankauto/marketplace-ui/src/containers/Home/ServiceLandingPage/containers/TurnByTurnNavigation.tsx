import React from 'react';
import { useServiceRequest } from 'store/service/request';
import { ServiceStep } from 'types/Service';
import { getInitialServiceRequestValues } from 'containers/ServiceRequest/utils';
import { VehicleNumberChecker } from './VehicleNumberChecker';
import { SelectWorkType } from './SelectWorkType';
import { SelectBrand } from './SelectBrand';
import { SelectModel } from './SelectModel';
import { SelectYear } from './SelectYear';
import { AdditionalInformation } from './AdditionalInformation';
import { MapSearch } from './MapSearch';
import { Confirmation } from './Confirmation';
import { NavHeader } from '../components/NavHeader';
import { SuccessPopup } from '../components/SuccessPopup';
import { getWorkTypeDescription } from '../helpers';

type navSchemeProps = {
  data: any;
  navigate: (step: ServiceStep) => void;
};

const carDetails = ({ data, navigate }: navSchemeProps) => [
  { label: getWorkTypeDescription(data.workType), onClick: () => navigate(ServiceStep.WORK_TYPE) },
  { label: data.brand?.name, onClick: () => navigate(ServiceStep.BRAND) },
  { label: data.model?.name, onClick: () => navigate(ServiceStep.MODEL) },
  { label: data.year, onClick: () => navigate(ServiceStep.YEAR) },
];

const navScheme = ({ data, navigate }: navSchemeProps) =>
  ({
    [ServiceStep.WORK_TYPE]: {
      Screen: SelectWorkType,
      screenProps: {},
      navProps: {},
    },
    [ServiceStep.CHECK_VEHICLE_NUMBER]: {
      Screen: VehicleNumberChecker,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.WORK_TYPE),
        items: [{ label: data.workType?.label, onClick: () => navigate(ServiceStep.WORK_TYPE) }],
      },
    },
    [ServiceStep.BRAND]: {
      Screen: SelectBrand,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.WORK_TYPE),
        items: [{ label: data.workType?.label, onClick: () => navigate(ServiceStep.WORK_TYPE) }],
      },
    },
    [ServiceStep.MODEL]: {
      Screen: SelectModel,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.BRAND),
        items: [
          { label: data.workType?.label, onClick: () => navigate(ServiceStep.WORK_TYPE) },
          { label: data.brand?.name, onClick: () => navigate(ServiceStep.BRAND) },
        ],
      },
    },
    [ServiceStep.YEAR]: {
      Screen: SelectYear,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.MODEL),
        items: [
          { label: data.workType?.label, onClick: () => navigate(ServiceStep.WORK_TYPE) },
          { label: data.brand?.name, onClick: () => navigate(ServiceStep.BRAND) },
          { label: data.model?.name, onClick: () => navigate(ServiceStep.MODEL) },
        ],
      },
    },
    [ServiceStep.CAR_INFO]: {
      Screen: AdditionalInformation,
      screenProps: {},
      navProps: {
        onBack: () => navigate(ServiceStep.YEAR),
        items: carDetails({ data, navigate }),
      },
    },
    [ServiceStep.SEARCH_MAP]: {
      Screen: MapSearch,
      screenProps: {},
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

export const TurnByTurnNavigation = () => {
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
