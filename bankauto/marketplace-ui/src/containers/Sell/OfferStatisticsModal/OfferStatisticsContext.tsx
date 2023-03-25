import React, { memo, useEffect, useCallback, useContext, useState } from 'react';
import { getClientVehicleStatistics } from 'api';
import { useNotifications } from 'store/notifications';

export type Statistics = {
  totalViews: number;
  weeklyViews: number;
  phoneRequests: number;
  comparedCount: number;
  daysPublished: number;
  favoritesCount: number;
  // daysTillUnpublish: number;
};

export interface OfferStatisticsContextValue {
  statistics: Statistics;
  isOpen: boolean;
  toggleOpen: () => void;
  fetchStatistics: (id: string | number) => () => void;
}

const statisticsInitial: Statistics = {
  totalViews: 0,
  weeklyViews: 0,
  phoneRequests: 0,
  favoritesCount: 0,
  comparedCount: 0,
  daysPublished: 0,
};

const initialValue: OfferStatisticsContextValue = {
  statistics: statisticsInitial,
  isOpen: false,
  toggleOpen: () => {},
  fetchStatistics: () => () => {},
};

const OfferStatisticsContext = React.createContext<OfferStatisticsContextValue>(initialValue);

export const OfferStatisticsContextProvider = memo(({ children }) => {
  const { notifyError } = useNotifications();
  const [isOpen, setisOpen] = useState<boolean>(false);
  const [statistics, setStatistics] = useState<Statistics>(statisticsInitial);

  useEffect(() => {
    if (!isOpen) {
      setStatistics(statisticsInitial);
    }
  }, [isOpen, setStatistics]);

  const fetchStatistics = useCallback(
    (vehicleId: string | number) => () => {
      setisOpen(true);
      getClientVehicleStatistics(vehicleId)
        .then(({ data }) => setStatistics(data))
        .catch((e) => {
          notifyError(e);
        });
    },
    [],
  );

  const toggleOpen = useCallback(() => {
    setisOpen(!isOpen);
  }, [setisOpen, isOpen]);

  return (
    <OfferStatisticsContext.Provider value={{ isOpen, statistics, fetchStatistics, toggleOpen }}>
      {children}
    </OfferStatisticsContext.Provider>
  );
});

export const useOfferStatisticsContext = () => useContext(OfferStatisticsContext);
