import React from 'react';
import { BackdropModal } from '@marketplace/ui-kit';
import { Props as BackdropModalProps } from '@marketplace/ui-kit/components/BackdropModal';
import { SimpleModalNew } from 'components/SimpleModalNew/SimpleModalNew';
import { ReactComponent as IconError } from 'icons/iconErrorNew.svg';

type ChangedConditionsMessageModal = Required<Pick<BackdropModalProps, 'opened' | 'handleOpened' | 'onClose'>>;

export const ChangedConditionsMessageModal = ({ opened, handleOpened, onClose }: ChangedConditionsMessageModal) => {
  const handleButtonClick = () => {
    handleOpened(false);
    onClose();
  };

  return (
    <BackdropModal opened={opened} handleOpened={handleOpened} onClose={onClose}>
      {({ handleClose }) => (
        <SimpleModalNew
          icon={IconError}
          title="Условия покупки данного автомобиля изменились"
          subtitle="Условия будут обновлены автоматически после закрытия окна"
          btnText="Обновить условия"
          handleClose={handleClose}
          isClosable
          onBtnClick={handleButtonClick}
        />
      )}
    </BackdropModal>
  );
};
