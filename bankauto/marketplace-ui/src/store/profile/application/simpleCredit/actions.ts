import { APPLICATION_CREDIT_STATUS } from '@marketplace/ui-kit/types';
import { AsyncAction } from 'types/AsyncAction';
import { updateSimpleCreditStatus } from 'api/application';
import { messageModalActions } from 'store/message-modal';
import { MessageModalName } from 'types/MessageModal';
import { actions } from './reducers';

function changeSimpleCreditStatus(status: APPLICATION_CREDIT_STATUS): AsyncAction {
  return async function (dispatch, getState) {
    const {
      application: {
        simpleCredit: { id: creditId },
      },
    } = getState();
    dispatch(actions.setLoading(true));

    if (!creditId) {
      dispatch(actions.setError(new Error('No credit id')));
      return;
    }

    try {
      await updateSimpleCreditStatus(creditId!, status);
      dispatch(actions.setCreditStatus(status));
      dispatch(actions.setLoading(false));
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

function cancelSimpleCredit(callback: () => void): AsyncAction {
  return async function (dispatch) {
    try {
      dispatch(
        messageModalActions.openWithControls({
          name: MessageModalName.SIMPLE_CREDIT_CANCEL_REQUESTED,
          controls: [
            {
              title: 'Нет',
              variant: 'outlined',
              onClick: () => {
                dispatch(messageModalActions.close());
              },
            },
            {
              title: 'Да',
              onClick: async () => {
                await dispatch(changeSimpleCreditStatus(APPLICATION_CREDIT_STATUS.CANCEL));
                dispatch(messageModalActions.close());
                callback();
              },
            },
          ],
        }),
      );
    } catch (err) {
      dispatch(actions.setError(err));
    }
  };
}

export { cancelSimpleCredit };
