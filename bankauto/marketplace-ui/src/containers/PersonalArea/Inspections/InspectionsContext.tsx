import React, { memo, useCallback, useContext, useMemo, useState, PropsWithChildren } from 'react';
import { InspectionsActions, InspectionsProviderProps, InspectionsState, InspectionVehicle } from './types';
import { useNotifications } from 'store/notifications'; //TODO: заменить в модуле

export interface InspectionsContextValue {
  state: InspectionsState;
  actions: InspectionsActions;
}

const initialState: InspectionsState = {
  loading: false,
  items: [],
};

const intitialActions: InspectionsActions = {
  setLoading: () => {},
  fetchItems: () => {},
  handleRemove: () => () => {},
  handleCreate: () => Promise.resolve(),
};

const defaultValue: InspectionsContextValue = { state: initialState, actions: intitialActions };

const InspectionsContext = React.createContext<InspectionsContextValue>(defaultValue);

export const InspectionsContextProvider = memo(
  ({
    value: { getInspections, removeInspection, createInspection },
    children,
  }: PropsWithChildren<InspectionsProviderProps>) => {
    const { notifyError } = useNotifications();
    const [loading, setLoading] = useState(false);
    const [items, setItems] = useState<InspectionVehicle[]>([]);

    const state = {
      loading,
      items,
    };

    const fetchItems = useCallback(() => {
      setLoading(true);
      getInspections()
        .then(({ data }) => {
          setItems(data);
        })
        .catch((e) => {
          notifyError(e);
        })
        .finally(() => {
          setLoading(false);
        });
    }, [setItems, setLoading, getInspections, notifyError]);

    const handleRemove = useCallback(
      (id: number) => () => {
        setLoading(true);
        removeInspection(id)
          .then(() => {
            setItems((prevItems) => prevItems.filter((item) => item.id !== id));
          })
          .catch((e) => {
            notifyError(e);
          })
          .finally(() => {
            setLoading(false);
          });
      },
      [setItems, removeInspection, notifyError],
    );

    const handleCreate = (vehicleId: number | string, cbSuccess: (orderId: number) => void) =>
      createInspection(vehicleId).then(({ data: { orderId } }) => {
        cbSuccess(orderId);
      });

    const actionsMemo = useMemo(
      () => ({
        setLoading,
        fetchItems,
        handleRemove,
        handleCreate,
      }),
      [setLoading, fetchItems, handleRemove],
    );
    //TODO: добавить ThemeProvider при переносе в модуль
    return (
      <InspectionsContext.Provider value={{ ...defaultValue, ...{ state, actions: actionsMemo } }}>
        {children}
      </InspectionsContext.Provider>
    );
  },
);

export const useInspectionsContext = () => useContext(InspectionsContext);
