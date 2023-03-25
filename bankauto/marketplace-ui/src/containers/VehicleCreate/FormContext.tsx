import React, { PropsWithChildren, memo, useContext } from 'react';
import { VehicleFormCatalogType } from 'types/VehicleFormType';

interface FormVehicleContextValue {
  catalogType: VehicleFormCatalogType;
  id?: string | number;
}

const defaults: FormVehicleContextValue = {
  catalogType: 'avito',
};

const FormVehicleContext = React.createContext<FormVehicleContextValue>(defaults);

interface FormVehicleProviderProps {
  value: Partial<FormVehicleContextValue>;
}

export const FormVehicleProviderRoot = ({ children, value }: PropsWithChildren<FormVehicleProviderProps>) => (
  <FormVehicleContext.Provider value={{ ...defaults, ...value }}>{children}</FormVehicleContext.Provider>
);

export const FormVehicleProvider = memo(FormVehicleProviderRoot);

export const useFormVehicleContext = () => useContext(FormVehicleContext);
