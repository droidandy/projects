import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import { Form } from 'lib/form';
import sleep from 'lib/sleep';

import ProgressFake from 'components/ProgressFake';

const FormModal = ({
  children,
  title = '',
  onComplete,
  onCancel,
  btnSubmitLabel = 'Submit',
  redirect = true,
  noButtons = false,
  size = 'md',
  ...props
}) => {
  let history = useHistory();
  let [isCompleted, setCompleted] = useState(false);

  return (
    <Form
      onSubmitSuccess={async (result, passedProps) => {
        setCompleted(true);
        await sleep(2 * 1000);
        if (onComplete) {
          await onComplete(result, passedProps);
        }
        return redirect && history.goBack();
      }}
      {...props}
    >
      {formProps => {
        const toggle = () => !formProps.isSubmitting && history.goBack();

        return (
          <Modal isOpen scrollable toggle={toggle} size={size}>
            <ModalHeader toggle={toggle}>{title}</ModalHeader>
            <ModalBody>
              <fieldset disabled={formProps.isSubmitting}>{children(formProps)}</fieldset>
              {formProps.isSubmitting && (
                <ProgressFake interval={500} step={3} isCompleted={isCompleted} />
              )}
            </ModalBody>
            {!noButtons ? (
              <ModalFooter style={{ padding: '0.25rem' }}>
                <Button
                  color="link"
                  onClick={() => (onCancel ? onCancel() : toggle())}
                  disabled={formProps.isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  color="primary"
                  onClick={formProps.submitForm}
                  disabled={formProps.isSubmitting}
                >
                  {formProps.isSubmitting ? (
                    <i className="fas fa-spinner fa-spin" />
                  ) : (
                    <span>{btnSubmitLabel}</span>
                  )}
                </Button>
              </ModalFooter>
            ) : null}
          </Modal>
        );
      }}
    </Form>
  );
};

export default FormModal;
