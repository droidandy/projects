import React, { useCallback } from 'react';
import { useStyles } from './BookingSuccessModal.styles';
import { ModalLight } from 'components/ModalLight';
import { BookingSuccessModalContent } from './BookingSuccessModalContent';

type BookingSuccessModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const BookingSuccessModal = ({ isOpen, setIsOpen }: BookingSuccessModalProps) => {
  const s = useStyles();
  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      <BookingSuccessModalContent onContinue={handleCloseModal} />
    </ModalLight>
  );
};
