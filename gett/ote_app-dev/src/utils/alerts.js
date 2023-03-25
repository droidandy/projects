import { strings } from 'locales';
import { AlertModal, AlertStatic, ModalAlertStatic } from 'components';

import { utils } from 'testIDs';

const IDs = utils.alerts;

export function showConfirmationAlert({ message = strings('alert.message.areYouSure'), handler = () => {}, ...rest }) {
  AlertModal.show({
    message,
    buttons: [
      { testID: IDs.confirmationResetBtn, title: strings('alert.button.no'), type: 'secondary' },
      { testID: IDs.confirmationSubmitBtn, title: strings('alert.button.yes'), onPress: handler }
    ],
    testID: IDs.confirmationAlert,
    ...rest
  });
}

export function showMessageAlert({ title = '', message = '', ...rest }) {
  return AlertModal.show({
    title,
    message,
    buttons: [
      { title: strings('alert.button.ok') }
    ],
    ...rest
  });
}

export function showRemovalAlert({
  title = '',
  message = strings('alert.message.doYouWantToDelete'),
  deleteLabel = strings('alert.button.delete'),
  handler = () => {},
  ...rest
}) {
  return AlertModal.show({
    title,
    message,
    buttons: [
      { title: strings('alert.button.cancel'), type: 'secondary' },
      { testID: IDs.removalSubmitBtn, title: deleteLabel, onPress: handler }
    ],
    testID: IDs.removalAlert,
    ...rest
  });
}

export function showInfoAlert({ type = 'failed', message, position = 'top', onClose = null, testID, modal = false }) {
  const Alert = modal ? ModalAlertStatic : AlertStatic;

  return Alert.show({ type, message, position, onClose, testID });
}
