import React, { FC, useCallback, useState } from 'react';
import { Button, Typography } from '@marketplace/ui-kit';
import { CancelModal } from '../InspectionModals';

interface Props {
  text: string;
  className?: string;
  callback?: () => void;
}

export const CancelButton: FC<Props> = ({ text, className, callback }) => {
  const [isOpenModal, setIsOpenModal] = useState(false);

  const toggleOpen = useCallback(() => {
    setIsOpenModal(!isOpenModal);
  }, [isOpenModal]);

  return (
    <>
      <Button variant="text" color="primary" onClick={callback || toggleOpen} className={className}>
        <Typography variant="h5" color="primary" component="span">
          {text}
        </Typography>
      </Button>
      {!callback && <CancelModal isOpen={isOpenModal} toggleOpen={toggleOpen} />}
    </>
  );
};
