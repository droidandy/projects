import React, { FC, memo, useCallback } from 'react';
import { Form } from 'react-final-form';
import { User } from '@marketplace/ui-kit/types';
import { Box, Grid, PHONE_INPUT_FORMAT } from '@marketplace/ui-kit';
import { ProfileMainInfoFormData } from 'types/ProfileMainInfoFormData';
import { FormProps } from 'types/FormProps';
import { Input, SelectNew as Select } from 'components/Fields';
import { makeValidateSync } from 'components/Fields/validation';
import { SelectNode, SelectNodeOption } from 'components/Fields/SelectNode';
import { withoutCode } from 'helpers';
import { capitalizeInputValueWC } from 'helpers/capitalizeInputValue';
import { ProfileInfoSchema } from './ProfileMainInfoForm.schema';

const validate = makeValidateSync(ProfileInfoSchema);

interface CityOptions {
  cityOptions: SelectNodeOption[];
}

interface Props extends FormProps {
  data: User & CityOptions;
  handleSave: (values: ProfileMainInfoFormData) => void;
}

const ProfileMainInfoFormRoot: FC<Props> = ({ handleSave, data }) => {
  const handleSubmitAction = useCallback((values: ProfileMainInfoFormData) => {
    handleSave({
      phone: '',
      firstName: values.firstName,
      lastName: values.lastName || null,
      patronymicName: values.patronymicName || null,
      gender: values.gender === null ? undefined : values.gender,
      email: values.email,
      cityId: values.cityId,
    });
  }, []);

  return (
    <Form
      onSubmit={handleSubmitAction}
      initialValues={{ ...data, phone: data.phone ? withoutCode(data.phone) : '' }}
      validateOnBlur
      validate={validate}
    >
      {() => (
        <form>
          <Box py={8}>
            <Grid container spacing={4}>
              <Grid item sm={3} xs={12}>
                <Input disabled key="lastName" name="lastName" placeholder="Фамилия" parse={capitalizeInputValueWC} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Input disabled key="firstName" name="firstName" placeholder="Имя" parse={capitalizeInputValueWC} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Input
                  disabled
                  key="patronymic"
                  name="patronymicName"
                  placeholder="Отчество"
                  parse={capitalizeInputValueWC}
                />
              </Grid>
              <Grid item sm={3} xs={12}>
                <SelectNode disabled name="cityId" key="cityId" placeholder="Город" options={data.cityOptions} />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Input key="phone" name="phone" placeholder="Телефон" mask={PHONE_INPUT_FORMAT} disabled />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Input disabled name="email" key="email" type="email" placeholder="Электронная почта" />
              </Grid>
              <Grid item sm={3} xs={12}>
                <Select
                  disabled
                  name="gender"
                  key="gender"
                  placeholder="Пол"
                  options={[
                    { label: 'Мужчина', value: '0' },
                    { label: 'Женщина', value: '1' },
                  ]}
                />
              </Grid>
              {/* <Grid item xs={12}> */}
              {/*  <Grid container spacing={4} justify="center"> */}
              {/*    <Grid item sm={3} xs={12}> */}
              {/*      <Button */}
              {/*        className={css.submitButton} */}
              {/*        fullWidth */}
              {/*        size="large" */}
              {/*        color="default" */}
              {/*        variant="contained" */}
              {/*        onClick={handleSubmit} */}
              {/*      > */}
              {/*        Сохранить изменения */}
              {/*      </Button> */}
              {/*    </Grid> */}
              {/*  </Grid> */}
              {/* </Grid> */}
            </Grid>
          </Box>
        </form>
      )}
    </Form>
  );
};

const ProfileMainInfoForm = memo(ProfileMainInfoFormRoot);

export { ProfileMainInfoForm };
