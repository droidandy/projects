import React, { useCallback } from 'react';
import { ModalLight } from 'components/ModalLight';
import { LearnMoreModalContent } from './LearnMoreModalContent';
import { useStyles } from './LearnMoreModal.styles';

type LearnMoreModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export const LearnMoreModal = ({ isOpen, setIsOpen }: LearnMoreModalProps) => {
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
      <LearnMoreModalContent />
    </ModalLight>
  );
};
