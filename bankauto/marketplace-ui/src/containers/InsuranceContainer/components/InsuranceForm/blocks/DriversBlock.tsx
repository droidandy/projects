import Grid from '@material-ui/core/Grid';
import RemoveCircle from '@material-ui/icons/RemoveCircle';
import AddCircle from '@material-ui/icons/AddCircle';
import { FieldArray } from 'react-final-form-arrays';
import React, { useEffect } from 'react';
import { Checkbox } from 'components/Fields';
import { Button, Typography, useBreakpoints } from '@marketplace/ui-kit';
import { useField, useForm } from 'react-final-form';
import { useSelector } from 'react-redux';
import DriverBlock from './DriverBlock';
import { useStyles } from '../InsuranceForm.styles';
import { StateModel } from '../../../../../store/types';

const EMPTY_SUBSCRIPTION = {};

const driverDefaultValues = {
  lastName: '',
  firstName: '',
  middleName: '',
  dateOfBirth: '',
  driverLicenseNumber: '',
  drivingExperienceDateStart: '',
};

const useFieldValue = (name: string) => {
  const {
    input: { value },
  } = useField(name, { subscription: { value: true } });
  return value;
};

const DriversBlock = () => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const user = useSelector((state: StateModel) => state.user);

  const form = useForm();

  const isInsurantDriver = useFieldValue('isInsurantDriver');
  const firstName = useFieldValue('firstName');
  const lastName = useFieldValue('lastName');
  const middleName = useFieldValue('middleName');
  const dateOfBirth = useFieldValue('insurant.dateOfBirth');
  const sexCode = user.gender === 0 ? 'M' : user.gender === 1 ? 'F' : '';
  useEffect(() => {
    if (isInsurantDriver) {
      const { values } = form.getState();
      form.change('drivers[0].lastName', values.lastName);
      form.change('drivers[0].firstName', values.firstName);
      form.change('drivers[0].middleName', values.middleName);
      form.change('drivers[0].sexCode', sexCode);
      if (values.insurant) {
        form.change('drivers[0].dateOfBirth', values.insurant.dateOfBirth);
      }
    }
  }, [isInsurantDriver, firstName, lastName, middleName, sexCode, dateOfBirth, form]);

  return (
    <FieldArray name="drivers" subscription={EMPTY_SUBSCRIPTION}>
      {({ fields }) => (
        <>
          <Grid item>
            <Grid
              container
              spacing={2}
              direction={isMobile ? 'column' : 'row'}
              justify="space-between"
              className={s.subtitle}
            >
              <Grid item>
                <Typography variant="body1">
                  <b>Водители</b>
                </Typography>
              </Grid>
              <Grid item>
                <Checkbox name="isInsurantDriver" color="primary" label="Страхователь является водителем" />
              </Grid>
            </Grid>
          </Grid>
          {fields.map((name, index) => (
            <Grid item key={name}>
              <Grid container spacing={3} direction="column">
                {index !== 0 && (
                  <Grid item>
                    <Grid container spacing={2} justify="space-between" className={s.subtitle}>
                      <Grid item />
                      <Grid item>
                        <Button onClick={() => fields.remove(index)} startIcon={<RemoveCircle color="primary" />}>
                          <b>Удалить водителя</b>
                        </Button>
                      </Grid>
                    </Grid>
                  </Grid>
                )}
                <Grid item>
                  <DriverBlock name={name} index={index} />
                </Grid>
              </Grid>
            </Grid>
          ))}
          <Grid item>
            <Grid container spacing={2} justify="space-between" className={s.subtitle}>
              <Grid item>
                <Button
                  onClick={() => fields.push({ ...driverDefaultValues })}
                  startIcon={<AddCircle color="primary" />}
                >
                  <b>Добавить водителя</b>
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </>
      )}
    </FieldArray>
  );
};

export default DriversBlock;
