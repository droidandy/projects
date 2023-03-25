import React, { Fragment, useState, useCallback } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';

const defaultOptions = {
  title: 'Are you sure?',
  description: '',
  confirmationText: 'Ok',
  cancellationText: 'Cancel',
  dialogProps: {},
  onClose: () => {},
  onCancel: () => {},
};

const withConfirm = WrappedComponent => props => {
  const [onConfirm, setOnConfirm] = useState(null);
  const [options, setOptions] = useState(defaultOptions);
  const {
    title,
    description,
    confirmationText,
    cancellationText,
    dialogProps,
    onClose,
    onCancel,
  } = options;

  const handleClose = useCallback(() => {
    onClose();
    setOnConfirm(null);
  }, [onClose]);

  const handleCancel = useCallback(() => {
    onCancel();
    handleClose();
  }, [onCancel, handleClose]);

  const handleConfirm = useCallback(
    (...args) => {
      onConfirm(...args);
      handleClose();
    },
    [onConfirm, handleClose]
  );

  /* Returns function opening the dialog, passed to the wrapped component. */
  const confirm = useCallback(
    (onConfirm, options = {}) => () => {
      setOnConfirm(() => onConfirm);
      setOptions({ ...defaultOptions, ...options });
    },
    []
  );

  return (
    <Fragment>
      <WrappedComponent {...props} confirm={confirm} />
      <Modal {...dialogProps} isOpen={!!onConfirm} toggle={handleCancel}>
        {title && <ModalHeader toggle={handleCancel}>{title}</ModalHeader>}
        {description && (
          <ModalBody>
            <div>{description}</div>
          </ModalBody>
        )}
        <ModalFooter>
          <Button onClick={handleCancel}>{cancellationText}</Button>
          <Button onClick={handleConfirm} color="primary">
            {confirmationText}
          </Button>
        </ModalFooter>
      </Modal>
    </Fragment>
  );
};

export default withConfirm;
