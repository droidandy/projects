/* eslint-disable react/jsx-props-no-spreading */
import React, {
  useState, useCallback, useContext, useEffect,
} from 'react';

import { Alert } from '~/components/customAlert';
import { AlertProps } from '~/components/customAlert/customAlertTypes';

export type AlertContextType = (alertProps: AlertProps) => void;

const AlertContext = React.createContext<AlertContextType | null>(null);

export const useAlert = () => useContext<AlertContextType | null>(AlertContext);

const withAlert = <P extends Record<string, unknown>>(Wrapped: React.ComponentType<P>): (
  props: AlertProps
) => JSX.Element => {
  const ComponentWithAlert = (props: AlertProps) => {
    const [visible, setVisible] = useState(false);
    const [alert, setAlert] = useState<AlertProps | null>(null);

    const { title, message, duration } = alert || {};

    useEffect(() => {
      const timer = setTimeout(() => setVisible(false), duration || 3000);

      return () => {
        clearTimeout(timer);
      };
    }, [visible]);

    const showAlert = useCallback((alertProps: AlertProps) => {
      setAlert(alertProps);
      setVisible(true);
    }, []);

    return (
      <AlertContext.Provider value={showAlert}>
        <Alert
          show={visible}
          title={title}
          message={message}
        />
        <Wrapped alert={showAlert} {...props} />
      </AlertContext.Provider>
    );
  };
  return ComponentWithAlert;
};

export default withAlert;
