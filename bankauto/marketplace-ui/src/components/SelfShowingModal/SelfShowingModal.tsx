import React, { FC, ReactElement, useState, MouseEventHandler, SyntheticEvent } from 'react';

import { BackdropModal } from '@marketplace/ui-kit';

interface Props {
  component: ({ handleOpen }: { handleOpen: MouseEventHandler<HTMLElement> }) => ReactElement;
  modal: ({ handleClose }: { handleClose: MouseEventHandler<HTMLElement> }) => ReactElement;
}

const SelfShowingModal: FC<Props> = ({ component, modal }) => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const handleOpen = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowModal(true);
  };
  const handleClose = () => setShowModal(false);
  return (
    <>
      {component({ handleOpen })}
      <BackdropModal opened={showModal} handleOpened={setShowModal} onClose={handleClose}>
        {() => modal({ handleClose })}
      </BackdropModal>
    </>
  );
};

export { SelfShowingModal };
