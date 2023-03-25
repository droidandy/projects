import React from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardFooter,
  Button,
} from 'reactstrap';
import { Form } from 'lib/form';

const FormCard = ({
  children,
  title = '',
  subtitle = '',
  header = '',
  footer = '',
  onComplete,
  onCancel,
  btnSubmitLabel = 'Submit',
  btnCancelLabel = 'Cancel',
  noButtons = false,
  CardProps = {},
  ...props
}) => {
  return (
    <Form
      onSubmitSuccess={async (result, passedProps) => {
        if (onComplete) {
          await onComplete(result, passedProps);
        }
      }}
      {...props}
    >
      {formProps => {
        return (
          <Card {...CardProps}>
            {header && <CardHeader>{header}</CardHeader>}
            <CardBody>
              {title && <CardTitle>{title}</CardTitle>}
              {subtitle && <CardSubtitle>{subtitle}</CardSubtitle>}
              <fieldset disabled={formProps.isSubmitting}>{children(formProps)}</fieldset>
              {!noButtons ? (
                <div className="d-flex align-items-center mt-3">
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
                  <Button
                    type="button"
                    color="link"
                    onClick={onCancel}
                    disabled={formProps.isSubmitting}
                  >
                    {btnCancelLabel}
                  </Button>
                </div>
              ) : null}
            </CardBody>
            {footer && <CardFooter>{footer}</CardFooter>}
          </Card>
        );
      }}
    </Form>
  );
};

export default FormCard;
