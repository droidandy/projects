import React from 'react';
import cx from 'classnames';
import { useSelector } from 'react-redux';
import { Typography } from '@marketplace/ui-kit';
import { selectServiceRequestForm } from 'store/service/request';
import { ModalLight } from 'components/ModalLight';
import { SmsForm } from './SmsForm';
import { useStyles } from './ConfirmPhoneBySms.styles';

interface Props {
  isVisible: boolean;
  onSet: (val: boolean) => void;
  handleSubmitForm: (val: any) => void;
  codeError?: string;
}

export const ConfirmPhoneBySms = ({ isVisible, onSet, handleSubmitForm, codeError }: Props) => {
  const s = useStyles();
  const { phone } = useSelector(selectServiceRequestForm);

  const handleOpened = (val: boolean) => onSet(val);

  const handleClose = () => onSet(false);

  return (
    <ModalLight
      key="confirmPhone"
      isOpen={isVisible}
      handleOpened={handleOpened}
      onClose={handleClose}
      showCloseIcon={true}
      classes={{ root: cx({ [s.root]: true }) }}
    >
      <div>
        <div className={s.textWrapper}>
          <Typography component="pre" variant="h5">
            {'Подтвердите указанный номер\nс помощью SMS-кода'}
          </Typography>
        </div>

        <SmsForm
          handleSubmitForm={handleSubmitForm}
          phoneFromRedux={phone}
          codeError={codeError}
          shouldAutoSendSms={false}
          phoneEditable={false}
        />
      </div>
    </ModalLight>
  );
};
