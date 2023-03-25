import React, { useCallback } from 'react';
import { useStyles } from './BookingFailModal.styles';
import { ModalLight } from 'components/ModalLight';
import { BookingFailModalContent } from './BookingFailModalContent';

type BookingSuccessModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onRetry: () => Promise<void>;
};

export const BookingFailModal = ({ isOpen, setIsOpen, onRetry }: BookingSuccessModalProps) => {
  const s = useStyles();

  const handleCloseModal = useCallback(() => setIsOpen(false), [setIsOpen]);

  const handleRetry = useCallback(() => {
    onRetry();
  }, [onRetry]);

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      <BookingFailModalContent onRetry={handleRetry} />
    </ModalLight>
  );
};
