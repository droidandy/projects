import React, { useState, useEffect } from 'react';
import { Alert } from '@material-ui/lab';
import { useDispatch, useSelector } from 'react-redux';
import { StateModel } from 'store/types';
import Snackbar, { SnackbarOrigin } from '@material-ui/core/Snackbar';
import { removeFlashMessage } from 'store/flash-messages';
import { Flash } from 'types/Flash';

export interface State extends SnackbarOrigin {
  open: boolean;
}
const MESSAGE_HIDE_DURATION = 6000;

const FlashMessage = () => {
  const dispatch = useDispatch();

  const messages = useSelector(({ flashMessages }: StateModel) => flashMessages);

  const [state, setState] = useState<State>({
    open: false,
    vertical: 'top',
    horizontal: 'center',
  });

  const { vertical, horizontal, open } = state;

  const handleRemoveMessage = (message: Flash, reason?: string) => {
    dispatch(removeFlashMessage(message.id));
    if (reason === 'clickaway') {
      return;
    }
    setState({ ...state, open: false });
  };

  useEffect(() => {
    if (messages.length) {
      setState({ ...state, open: true });
    }
  }, [messages]);

  return (
    <>
      {messages
        ? messages.map((message) => {
            return (
              <Snackbar
                key={message.id}
                anchorOrigin={{ vertical, horizontal }}
                open={open}
                autoHideDuration={MESSAGE_HIDE_DURATION}
                onClose={(event?: React.SyntheticEvent, reason?: string) => handleRemoveMessage(message, reason)}
              >
                <Alert severity={message.success ? 'success' : 'error'}>{message.message}</Alert>
              </Snackbar>
            );
          })
        : null}
    </>
  );
};

export { FlashMessage };
