import React, { createContext, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Alert } from '@material-ui/lab';
import Snackbar from '@material-ui/core/Snackbar';
import { useNotifications } from 'store/notifications';
import { NotificationItem } from 'types/Notification';
import { ColorIcon } from './components/Color';

const useSnackbarStyles = makeStyles(() => ({
  anchorOriginTopCenter: {
    top: '.625rem',
  },
}));

const useAlertStyles = makeStyles(
  ({ typography: { subtitle1 }, palette: { text, primary, secondary, success, error, warning } }) => ({
    root: {
      alignItems: 'center',
      padding: '1.1rem 1.25rem 1.2rem',
      ...subtitle1,
    },
    icon: {
      padding: 0,
      fontSize: '1.25rem',
    },
    message: {
      padding: 0,
      color: text.primary,
    },
    action: {
      color: text.primary,
      padding: 0,
      margin: 0,
      marginLeft: '.5rem',
    },
    standardSuccess: {
      background: secondary.light,
      color: success.main,
    },
    standardError: {
      background: secondary.light,
      color: error.main,
    },
    standardWarning: {
      background: secondary.light,
      color: warning.main,
    },
    standardInfo: {
      background: secondary.light,
      color: primary.main,
    },
  }),
);

const MESSAGE_HIDE_DURATION = 6000;

type NotificationProps = NotificationItem & {
  handlerClose: (id: NotificationItem['id']) => void;
};

interface NotificationContextProps {
  id: string;
  handleClose: () => void;
}

export const NotificationContext = createContext<NotificationContextProps>({ id: '', handleClose: () => {} });

export const useNotificationContext = () => useContext(NotificationContext);

const Notification = ({ id, message, props, handlerClose }: NotificationProps): JSX.Element => {
  const snackbarStyles = useSnackbarStyles();
  const alertStyles = useAlertStyles();
  const defaultProps = {
    severity: 'success',
  } as NotificationItem['props'];
  const alertProps = { ...defaultProps, ...props };
  return (
    <NotificationContext.Provider value={{ id, handleClose: () => handlerClose(id) }}>
      <Snackbar
        classes={snackbarStyles}
        key={id}
        open
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
        autoHideDuration={MESSAGE_HIDE_DURATION}
        onClose={(event?: React.SyntheticEvent, reason?: string) => {
          if (reason === 'clickaway') {
            return;
          }
          handlerClose(id);
        }}
      >
        <Alert classes={alertStyles} iconMapping={{ success: <ColorIcon /> }} {...alertProps}>
          {message}
        </Alert>
      </Snackbar>
    </NotificationContext.Provider>
  );
};

const Notifications = (): JSX.Element => {
  const { messages, removeMessage } = useNotifications();

  return (
    <>
      {messages.map((message) => (
        <Notification {...message} handlerClose={removeMessage} />
      ))}
    </>
  );
};

export default Notifications;
