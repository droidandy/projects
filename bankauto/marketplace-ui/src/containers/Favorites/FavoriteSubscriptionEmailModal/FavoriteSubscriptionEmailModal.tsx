import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Field, Form } from 'react-final-form';
import { Box, Button, InputBase, Typography } from '@marketplace/ui-kit';
import { setEmail } from 'store/user/actions';
import { ModalLight } from 'components/ModalLight';
import { makeValidateSync } from 'components/Fields/validation';
import { FavoriteSubscriptionEmailModalSchema } from './FavoriteSubscriptionEmailModalSchema';
import { useStyles } from './FavoriteSubscriptionEmailModal.styles';

type FavoriteSubscriptionEmailModalProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClose?: (success: boolean) => void;
};

type FormValues = {
  email: string | null;
};

const validate = makeValidateSync<FormValues, {}>(FavoriteSubscriptionEmailModalSchema);

export const FavoriteSubscriptionEmailModal = ({ isOpen, setIsOpen, onClose }: FavoriteSubscriptionEmailModalProps) => {
  const s = useStyles();

  const handleCloseModal = useCallback(
    (success: boolean = false) => {
      setIsOpen(false);
      onClose && onClose(success);
    },
    [setIsOpen],
  );

  const dispatch = useDispatch();

  const handleSubmit = useCallback(
    (values: FormValues) => {
      (dispatch(setEmail(values.email!)) as unknown as Promise<void>).then(() => {
        handleCloseModal(true);
      });
    },
    [dispatch, handleCloseModal],
  );

  return (
    <ModalLight
      isOpen={isOpen}
      handleOpened={setIsOpen}
      onClose={handleCloseModal}
      classes={{
        root: s.root,
      }}
    >
      <Typography variant="h5" component="h5">
        Укажите свой email, чтобы получать уведомления об изменении цен на избранные автомобили
      </Typography>
      <Box mb={5}>
        <Form onSubmit={handleSubmit} initialValues={{}} validate={validate}>
          {({ invalid, handleSubmit }) => {
            return (
              <>
                <Box my={5}>
                  <Field name="email">
                    {({ input, meta }) => (
                      <InputBase
                        error={meta.touched && !!meta.error}
                        helperText={meta.touched && meta.error ? (meta.error[0] as string) : undefined}
                        name={input.name}
                        value={input.value}
                        onBlur={input.onBlur}
                        onChange={input.onChange}
                        key="email"
                        type="text"
                        variant="standard"
                        placeholder="Email"
                      />
                    )}
                  </Field>
                </Box>
                <Button
                  fullWidth
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={invalid}
                  type="submit"
                  onClick={handleSubmit}
                >
                  <Typography variant="subtitle1" component="span">
                    Отправить
                  </Typography>
                </Button>
              </>
            );
          }}
        </Form>
      </Box>
    </ModalLight>
  );
};
