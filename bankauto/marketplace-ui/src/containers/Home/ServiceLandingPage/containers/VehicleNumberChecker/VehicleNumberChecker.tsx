import React, { FC, useState } from 'react';
import { Form } from 'react-final-form';
import { Typography } from '@material-ui/core';
import { useBreakpoints, Checkbox, Grid, Button } from '@marketplace/ui-kit';
import InputGroup from '@marketplace/ui-kit/components/InputGroup';
import { licenseDocumentsLinks } from 'constants/licenseDocumentsLinks';
import { InputVehicleNumber } from 'components/Fields';
import { FilterButtonSubmit } from 'components/FilterButton';
import { setFieldDataOptions } from 'helpers/formUtils';
import { PageContainer } from '../../components';
import { BaseButton } from '../../components';
import { ServiceStep } from 'types/Service';
import { Props } from './types';
import { useStyles } from './VehicleNumberChecker.styles';

const TEMPLATE = [['vehicleNumber']];

const vehicles = [
  { id: 1, name: 'Mazda' },
  { id: 2, name: 'Volkswagen Tiguan' },
  { id: 3, name: 'BMW X6' },
];

export const VehicleNumberChecker: FC<Props> = (props) => {
  const s = useStyles();
  const { isMobile } = useBreakpoints();
  const { header, onSet, navigate, initialValues } = props;
  const [expanded, setExpanded] = useState(false);
  const [isChecked, setIsChecked] = useState(true);

  const handleContinue = (values: any) => {
    onSet(values);
    navigate(ServiceStep.SEARCH_MAP);
  };

  const handleVehicleClick = () => {};

  const handleShowMoreClick = () => {
    setExpanded(true);
  };

  const handleManualButtonClick = () => {
    navigate(ServiceStep.BRAND);
  };

  const renderSavedVehicles = () => {
    if (!expanded) {
      const firstVehicle = vehicles[0];

      return (
        <div className={s.vehicleList}>
          <Button variant="text" color="primary" size="medium" onClick={handleVehicleClick} className={s.vehicleButton}>
            {firstVehicle.name}
          </Button>
        </div>
      );
    }

    return (
      <div className={s.vehicleList}>
        {vehicles.map((vehicle: any) => (
          <Button
            key={vehicle.id}
            variant="text"
            color="primary"
            size="medium"
            onClick={handleVehicleClick}
            className={s.vehicleButton}
          >
            {vehicle.name}
          </Button>
        ))}
      </div>
    );
  };

  const renderShowMoreButton = () => {
    if (vehicles.length > 1 && !expanded) {
      return (
        <Grid item className={s.showMoreButtonContainer}>
          <Button
            variant="text"
            color="primary"
            size="medium"
            onClick={handleShowMoreClick}
            className={s.showMoreButton}
          >
            {`Еще (${vehicles.length - 1})`}
          </Button>
        </Grid>
      );
    }

    return null;
  };

  const renderControls = (handleSubmit: any) => {
    if (isMobile) {
      return (
        <Grid container direction="column" spacing={1} wrap="nowrap">
          <Grid item className={s.controlWrapper}>
            <InputVehicleNumber
              className={s.input}
              name="licensePlate"
              area="licensePlate"
              placeholder="Госномер автомобиля"
              variant="outlined"
            />
          </Grid>
          <Grid item>
            <Button
              className={s.submitButton}
              variant="contained"
              color="primary"
              size="large"
              type="button"
              fullWidth
              onClick={handleSubmit}
              disabled={!isChecked}
            >
              Продолжить
            </Button>
          </Grid>
        </Grid>
      );
    }

    return (
      <div className={s.controlWrapper}>
        <InputGroup className={s.inputGroup} templateAreas={TEMPLATE}>
          <div>
            <InputVehicleNumber
              className={s.input}
              name="licensePlate"
              area="licensePlate"
              placeholder="Госномер автомобиля"
              variant="outlined"
            />
          </div>
        </InputGroup>
        <FilterButtonSubmit type="button" onClick={handleSubmit} disabled={!isChecked}>
          <Typography variant="h5" className={s.btnText}>
            Продолжить
          </Typography>
        </FilterButtonSubmit>
      </div>
    );
  };

  return (
    <PageContainer>
      {header}

      <Form
        onSubmit={handleContinue}
        initialValues={initialValues}
        mutators={{ setFieldDataOptions }}
        subscription={{}}
      >
        {({ handleSubmit }) => (
          <div>
            <Typography
              variant={isMobile ? 'h5' : 'h4'}
              color="textPrimary"
              className={s.label}
              align={isMobile ? 'center' : 'left'}
            >
              Введите госномер автомобиля для выбора оптимального набора работ
            </Typography>

            {vehicles.length > 0 && (
              <Grid
                container
                direction={isMobile ? 'column' : 'row'}
                wrap="nowrap"
                justify="space-between"
                alignItems={isMobile ? 'flex-start' : 'center'}
                className={s.vehicleHistory}
              >
                <Grid container={!isMobile} item alignItems="flex-start">
                  <Typography variant="body2" component="div">
                    Мы сохранили ваш расчет:
                  </Typography>

                  {!isMobile && renderSavedVehicles()}
                </Grid>
                {isMobile && (
                  <Grid container justify="space-between">
                    <Grid item>{renderSavedVehicles()}</Grid>
                    {renderShowMoreButton()}
                  </Grid>
                )}

                {!isMobile && renderShowMoreButton()}
              </Grid>
            )}

            {renderControls(handleSubmit)}

            <Grid
              container
              direction={isMobile ? 'column' : 'row'}
              wrap="nowrap"
              justify="space-between"
              alignItems={isMobile ? 'flex-start' : 'center'}
            >
              <Grid item>
                <Checkbox
                  label={
                    <div>
                      Я принимаю{' '}
                      <a className={s.link} href={licenseDocumentsLinks.agreement} rel="noreferrer" target="_blank">
                        условия использования
                      </a>{' '}
                      сервиса
                    </div>
                  }
                  color="primary"
                  checked={isChecked}
                  onChange={(e, value) => setIsChecked(value)}
                />
              </Grid>
              <Grid item>
                <Button
                  fullWidth
                  variant="text"
                  color="primary"
                  onClick={handleManualButtonClick}
                  className={s.manualButton}
                >
                  Заполню данные самостоятельно
                </Button>
              </Grid>
            </Grid>
          </div>
        )}
      </Form>
    </PageContainer>
  );
};
