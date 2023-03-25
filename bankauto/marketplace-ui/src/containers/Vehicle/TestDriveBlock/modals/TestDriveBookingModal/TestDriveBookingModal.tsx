import React, { FC, useCallback, MouseEvent } from 'react';
import { BackdropModal } from '@marketplace/ui-kit';
import { SimpleModalNew } from 'components/SimpleModalNew';
import { ReactComponent as IconCheckCalendar } from 'icons/iconCheckCalendar.svg';

type TestDriveBookingModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  handleClick: (e?: MouseEvent<HTMLButtonElement>) => void;
  loading: boolean;
};

const TestDriveBookingModal: FC<TestDriveBookingModalProps> = ({ isOpen, setIsOpen, loading, handleClick }) => {
  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <BackdropModal opened={isOpen} handleOpened={setIsOpen} onClose={handleCloseModal}>
      {({ handleClose }) => (
        <SimpleModalNew
          icon={IconCheckCalendar}
          title="Запись на тест-драйв"
          subtitle="Наш менеджер свяжется с вами и поможет подобрать удобное время в ближайшем дилерском центре"
          btnText="Отправить заявку"
          onBtnClick={handleClick}
          handleClose={handleClose}
          isClosable
          loading={loading}
        />
      )}
    </BackdropModal>
  );
};
export { TestDriveBookingModal };
